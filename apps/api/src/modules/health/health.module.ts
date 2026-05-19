import { Module } from '@nestjs/common';

import { HealthController } from './health.controller.js';

/**
 * Feature module exposing `GET /health`.
 *
 * Kept in its own module so the root `AppModule` stays thin and so
 * future observability concerns (readiness, liveness, DB pings) can be
 * added here without touching unrelated wiring. (Requirement 21.5.)
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
