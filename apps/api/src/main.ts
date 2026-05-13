import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 * Bootstrap the Certiq NestJS application.
 *
 * The API is a scaffold for the landing-page scope (Requirement 21.5). It
 * exposes a health endpoint only; the Next.js app (`apps/web`) does not
 * depend on it at runtime.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 12500);
  await app.listen(port);
}

void bootstrap();
