import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

/**
 * Root application module.
 *
 * Intentionally minimal for the landing-page scope. The only wired
 * feature module is `HealthModule`, which exposes `GET /health` to
 * prove the monorepo builds and boots end-to-end (Requirement 21.5).
 */
@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
