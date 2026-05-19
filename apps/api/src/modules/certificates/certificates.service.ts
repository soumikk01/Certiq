import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Certificate, CertificateDocument } from '../../infrastructure/database/schemas/certificate.schema.js';
import { CacheService, CACHE_KEYS, CACHE_TTL } from '../../infrastructure/cache/cache.service.js';
import { StorageService, generateObjectKey } from '../../infrastructure/storage/storage.service.js';
import { validateFile, getExtensionFromMime } from '../../infrastructure/storage/file-validator.js';

export class CreateCertificateDto {
  title!: string;
  issuer!: string;
  credUrl?: string;
}

export class UpdateCertificateDto {
  title?: string;
  issuer?: string;
  credUrl?: string;
  verified?: boolean;
}

export interface CertificateWithUrl {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  issuer: string;
  objectKey: string | null;
  credUrl: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<CertificateDocument>,
    private readonly storageService: StorageService,
    private readonly cacheService: CacheService,
  ) {}

  async upload(
    userId: string,
    dto: CreateCertificateDto,
    file: Express.Multer.File,
  ): Promise<CertificateDocument> {
    // Step 1: Validate file
    validateFile(file);

    // Step 2: Generate object key
    const extension = getExtensionFromMime(file.mimetype);
    const objectKey = generateObjectKey(userId, extension);

    // Step 3: Upload to R2
    await this.storageService.upload({
      buffer: file.buffer,
      objectKey,
      contentType: file.mimetype,
      metadata: { userId, originalName: file.originalname },
    });

    // Step 4: Create DB record (with rollback on failure)
    try {
      const certificate = await this.certificateModel.create({
        userId: new Types.ObjectId(userId),
        title: dto.title,
        issuer: dto.issuer,
        objectKey,
        credUrl: dto.credUrl ?? null,
        verified: false,
      });

      // Step 5: Invalidate cache
      await this.cacheService.del(CACHE_KEYS.certificateList(userId));

      return certificate;
    } catch (error) {
      // ROLLBACK: Delete R2 object if DB write fails
      this.logger.error('DB write failed after R2 upload, rolling back', error);
      await this.storageService.delete(objectKey);
      throw new InternalServerErrorException('Failed to save certificate');
    }
  }

  async findAll(userId: string): Promise<CertificateWithUrl[]> {
    // Step 1: Try cache
    const cacheKey = CACHE_KEYS.certificateList(userId);
    const cached = await this.cacheService.get<CertificateDocument[]>(cacheKey);

    let certificates: CertificateDocument[];

    if (cached) {
      certificates = cached;
    } else {
      // Step 2: Cache miss → query DB
      certificates = await this.certificateModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      // Step 3: Populate cache
      await this.cacheService.set(cacheKey, certificates, CACHE_TTL.certificateList);
    }

    // Step 4: Resolve presigned URLs for each certificate
    const results: CertificateWithUrl[] = await Promise.all(
      certificates.map(async (cert) => {
        let imageUrl: string | null = null;
        if (cert.objectKey) {
          imageUrl = await this.getPresignedUrlWithCache(cert.objectKey);
        }
        return { ...cert, imageUrl };
      }),
    );

    return results;
  }

  async findOne(id: string, userId: string): Promise<CertificateWithUrl> {
    // Step 1: Try cache
    const cacheKey = CACHE_KEYS.certificate(id);
    let certificate = await this.cacheService.get<CertificateDocument>(cacheKey);

    // Step 2: Cache miss → query DB
    if (!certificate) {
      certificate = await this.certificateModel
        .findOne({
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        })
        .lean()
        .exec();

      if (!certificate) {
        throw new NotFoundException('Certificate not found');
      }

      // Populate cache
      await this.cacheService.set(cacheKey, certificate, CACHE_TTL.certificate);
    }

    // Step 3: Resolve presigned URL
    let imageUrl: string | null = null;
    if (certificate.objectKey) {
      imageUrl = await this.getPresignedUrlWithCache(certificate.objectKey);
    }

    return { ...certificate, imageUrl };
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCertificateDto,
  ): Promise<CertificateDocument> {
    const certificate = await this.certificateModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.issuer !== undefined && { issuer: dto.issuer }),
          ...(dto.credUrl !== undefined && { credUrl: dto.credUrl }),
          ...(dto.verified !== undefined && { verified: dto.verified }),
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Invalidate cache
    await this.cacheService.del(CACHE_KEYS.certificate(id));
    await this.cacheService.del(CACHE_KEYS.certificateList(userId));

    return certificate as CertificateDocument;
  }

  async delete(id: string, userId: string): Promise<void> {
    // Step 1: Find the document
    const certificate = await this.certificateModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .lean()
      .exec();

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Step 2: Delete R2 object if exists
    if (certificate.objectKey) {
      await this.storageService.delete(certificate.objectKey);
    }

    // Step 3: Delete DB document
    await this.certificateModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();

    // Step 4: Invalidate cache
    await this.cacheService.del(CACHE_KEYS.certificate(id));
    await this.cacheService.del(CACHE_KEYS.certificateList(userId));
    if (certificate.objectKey) {
      await this.cacheService.del(CACHE_KEYS.presignedUrl(certificate.objectKey));
    }
  }

  private async getPresignedUrlWithCache(objectKey: string): Promise<string | null> {
    // Try cache first
    const cached = await this.cacheService.get<string>(CACHE_KEYS.presignedUrl(objectKey));
    if (cached) return cached;

    // Generate new presigned URL
    try {
      const url = await this.storageService.getPresignedUrl(objectKey, 3600);

      // Cache for 55 minutes (URL valid for 60)
      await this.cacheService.set(CACHE_KEYS.presignedUrl(objectKey), url, CACHE_TTL.presignedUrl);

      return url;
    } catch {
      // R2 unreachable — return null per requirement 6.6
      this.logger.warn(`Failed to generate presigned URL for ${objectKey}`);
      return null;
    }
  }
}
