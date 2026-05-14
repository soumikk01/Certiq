import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException();
    return resume;
  }

  async create(userId: string, data: { title?: string; templateId?: string; content?: any }) {
    return this.prisma.resume.create({
      data: {
        userId,
        title: data.title ?? 'Untitled Resume',
        templateId: data.templateId ?? 'executive',
        content: data.content ?? {},
      },
    });
  }

  async update(id: string, userId: string, data: { title?: string; templateId?: string; content?: any; published?: boolean }) {
    const resume = await this.findById(id, userId);
    return this.prisma.resume.update({
      where: { id: resume.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.templateId !== undefined && { templateId: data.templateId }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
  }

  async delete(id: string, userId: string) {
    const resume = await this.findById(id, userId);
    await this.prisma.resume.delete({ where: { id: resume.id } });
    return { deleted: true };
  }
}
