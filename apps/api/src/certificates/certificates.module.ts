import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Certificate, CertificateSchema } from '../database/schemas/certificate.schema.js';
import { StorageModule } from '../storage/storage.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { CertificatesController } from './certificates.controller.js';
import { CertificatesService } from './certificates.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    StorageModule,
    AuthModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
