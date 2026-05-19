import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CacheModule } from './cache/cache.module.js';
import { StorageModule } from './storage/storage.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { CertificatesModule } from './certificates/certificates.module.js';

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
