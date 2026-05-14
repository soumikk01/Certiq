import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap the Certiq NestJS API.
 *
 * - CORS enabled for the landing page (port 12000) and dashboard (port 12001)
 * - Global prefix: /api
 * - Runs on port 12500
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:12000',
      'http://localhost:12001',
      // Production origins can be added here
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 12500);
  await app.listen(port);
  console.log(`Certiq API running on http://localhost:${port}/api`);
}

void bootstrap();
