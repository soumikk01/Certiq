import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ResumesService } from './resumes.service';

@Controller('resumes')
@UseGuards(AuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /** GET /resumes — list all resumes for the current user */
  @Get()
  async list(@CurrentUser('id') userId: string) {
    return this.resumesService.findAllByUser(userId);
  }

  /** GET /resumes/:id — get a single resume */
  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.resumesService.findById(id, userId);
  }

  /** POST /resumes — create a new resume */
  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() body: { title?: string; templateId?: string; content?: any },
  ) {
    return this.resumesService.create(userId, body);
  }

  /** PATCH /resumes/:id — update a resume */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { title?: string; templateId?: string; content?: any; published?: boolean },
  ) {
    return this.resumesService.update(id, userId, body);
  }

  /** DELETE /resumes/:id — delete a resume */
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.resumesService.delete(id, userId);
  }
}
