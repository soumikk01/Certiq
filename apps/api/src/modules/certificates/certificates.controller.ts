import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../../common/guards/auth.guard.js';
import { Session } from '../../common/decorators/current-user.decorator.js';
import { SessionUser } from '../../common/guards/auth.guard.js';
import {
  CertificatesService,
  CreateCertificateDto,
  UpdateCertificateDto,
} from './certificates.service.js';

@Controller('certificates')
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  /** POST /certificates/upload — upload a certificate with file */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Session() user: SessionUser,
    @Body() body: CreateCertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.certificatesService.upload(user.id, body, file);
  }

  /** GET /certificates — list all certificates with presigned URLs */
  @Get()
  async findAll(@Session() user: SessionUser) {
    return this.certificatesService.findAll(user.id);
  }

  /** GET /certificates/:id — get a single certificate with presigned URL */
  @Get(':id')
  async findOne(@Param('id') id: string, @Session() user: SessionUser) {
    return this.certificatesService.findOne(id, user.id);
  }

  /** PATCH /certificates/:id — update certificate metadata */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Session() user: SessionUser,
    @Body() body: UpdateCertificateDto,
  ) {
    return this.certificatesService.update(id, user.id, body);
  }

  /** DELETE /certificates/:id — delete certificate with R2 cleanup */
  @Delete(':id')
  async remove(@Param('id') id: string, @Session() user: SessionUser) {
    await this.certificatesService.delete(id, user.id);
    return { deleted: true };
  }
}
