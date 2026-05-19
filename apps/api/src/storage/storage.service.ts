import * as crypto from 'node:crypto';

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadParams {
  buffer: Buffer;
  objectKey: string;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  objectKey: string;
  etag: string;
  size: number;
}

export function generateObjectKey(userId: string, extension: string): string {
  return `certificates/${userId}/${crypto.randomUUID()}.${extension}`;
}

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.getOrThrow<string>('R2_ENDPOINT');
    const accessKeyId = this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>('R2_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(params: UploadParams): Promise<UploadResult> {
    const { buffer, objectKey, contentType, metadata } = params;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    try {
      const response = await this.s3Client.send(command);

      return {
        objectKey,
        etag: response.ETag?.replace(/"/g, '') ?? '',
        size: buffer.length,
      };
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ServiceUnavailableException(
          'Storage service is currently unavailable',
        );
      }
      throw error;
    }
  }

  async getPresignedUrl(
    objectKey: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      ResponseContentDisposition: 'attachment',
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ServiceUnavailableException(
          'Storage service is currently unavailable',
        );
      }
      throw error;
    }
  }

  async delete(objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      if (this.isNetworkError(error)) {
        throw new ServiceUnavailableException(
          'Storage service is currently unavailable',
        );
      }
      throw error;
    }
  }

  private isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      const networkIndicators = [
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'NetworkingError',
        'TimeoutError',
        'socket hang up',
      ];
      const message = error.message || '';
      const name = error.name || '';
      return networkIndicators.some(
        (indicator) =>
          message.includes(indicator) || name.includes(indicator),
      );
    }
    return false;
  }
}
