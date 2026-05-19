import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infrastructure/database/database.module.js';
import { AuthModule } from './infrastructure/auth/auth.module.js';
import { CacheModule } from './infrastructure/cache/cache.module.js';
import { StorageModule } from './infrastructure/storage/storage.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ResumesModule } from './modules/resumes/resumes.module.js';
import { CertificatesModule } from './modules/certificates/certificates.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    CacheModule,
    StorageModule,
    HealthModule,
    UsersModule,
    ResumesModule,
    CertificatesModule,
  ],
})
export class AppModule {}

