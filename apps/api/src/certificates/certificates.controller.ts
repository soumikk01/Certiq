import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  /** GET /certificates — list all certificates for the current user */
  @Get()
  async list(@CurrentUser('id') userId: string) {
    return this.certificatesService.findAllByUser(userId);
  }

  /** GET /certificates/:id — get a single certificate */
  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.certificatesService.findById(id, userId);
  }

  /** POST /certificates — create a new certificate */
  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() body: { title: string; issuer: string; imageUrl?: string; credUrl?: string },
  ) {
    return this.certificatesService.create(userId, body);
  }

  /** PATCH /certificates/:id — update a certificate */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { title?: string; issuer?: string; imageUrl?: string; credUrl?: string; verified?: boolean },
  ) {
    return this.certificatesService.update(id, userId, body);
  }

  /** DELETE /certificates/:id — delete a certificate */
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.certificatesService.delete(id, userId);
  }
}
