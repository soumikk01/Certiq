import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resume, ResumeDocument } from '../database/schemas/resume.schema.js';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
  ) {}

  async create(
    userId: string,
    data: { title?: string; templateId?: string; content?: Record<string, unknown> },
  ) {
    const resume = await this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title: data.title ?? 'Untitled Resume',
      templateId: data.templateId ?? 'executive',
      content: data.content ?? {},
    });
    return resume;
  }

  async findAll(userId: string) {
    return this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string) {
    const resume = await this.resumeModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async update(
    id: string,
    userId: string,
    data: { title?: string; templateId?: string; content?: Record<string, unknown>; published?: boolean },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.templateId !== undefined) updateData.templateId = data.templateId;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.published !== undefined) updateData.published = data.published;

    const resume = await this.resumeModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async delete(id: string, userId: string) {
    const resume = await this.resumeModel
      .findOneAndDelete({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return { deleted: true };
  }
}
