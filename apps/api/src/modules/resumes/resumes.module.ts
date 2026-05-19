import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumesController } from './resumes.controller.js';
import { ResumesService } from './resumes.service.js';
import { Resume, ResumeSchema } from '../../infrastructure/database/schemas/resume.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
