import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { Session } from '../../common/decorators/current-user.decorator.js';
import { ResumesService } from './resumes.service.js';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /** POST /resumes — create a new resume */
  @Post()
  async create(
    @Session() user: { id: string },
    @Body() body: { title?: string; templateId?: string; content?: Record<string, unknown> },
  ) {
    return this.resumesService.create(user.id, body);
  }

  /** GET /resumes — list all resumes for the current user */
  @Get()
  async list(@Session() user: { id: string }) {
    return this.resumesService.findAll(user.id);
  }

  /** GET /resumes/:id — get a single resume (ownership check) */
  @Get(':id')
  async get(@Param('id') id: string, @Session() user: { id: string }) {
    return this.resumesService.findOne(id, user.id);
  }

  /** PATCH /resumes/:id — update a resume (ownership check) */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Session() user: { id: string },
    @Body() body: { title?: string; templateId?: string; content?: Record<string, unknown>; published?: boolean },
  ) {
    return this.resumesService.update(id, user.id, body);
  }

  /** DELETE /resumes/:id — delete a resume (ownership check) */
  @Delete(':id')
  async remove(@Param('id') id: string, @Session() user: { id: string }) {
    return this.resumesService.delete(id, user.id);
  }
}
