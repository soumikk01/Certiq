import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (cert.userId !== userId) throw new ForbiddenException();
    return cert;
  }

  async create(userId: string, data: { title: string; issuer: string; imageUrl?: string; credUrl?: string }) {
    return this.prisma.certificate.create({
      data: {
        userId,
        title: data.title,
        issuer: data.issuer,
        imageUrl: data.imageUrl ?? null,
        credUrl: data.credUrl ?? null,
      },
    });
  }

  async update(id: string, userId: string, data: { title?: string; issuer?: string; imageUrl?: string; credUrl?: string; verified?: boolean }) {
    const cert = await this.findById(id, userId);
    return this.prisma.certificate.update({
      where: { id: cert.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.issuer !== undefined && { issuer: data.issuer }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.credUrl !== undefined && { credUrl: data.credUrl }),
        ...(data.verified !== undefined && { verified: data.verified }),
      },
    });
  }

  async delete(id: string, userId: string) {
    const cert = await this.findById(id, userId);
    await this.prisma.certificate.delete({ where: { id: cert.id } });
    return { deleted: true };
  }
}
