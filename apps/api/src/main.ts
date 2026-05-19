import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

/**
 * Bootstrap the Certiq NestJS API.
 *
 * - Body parser disabled (better-auth handles its own request parsing)
 * - CORS enabled for the landing page (port 12000), dashboard (port 12001),
 *   and any additional origins from CORS_ORIGINS env var (comma-separated)
 * - Global prefix: /api
 * - Runs on port 12500
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Parse additional CORS origins from environment variable
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];

  // Enable CORS for frontend apps
  app.enableCors({
    origin: ['http://localhost:12000', 'http://localhost:12001', ...corsOrigins],
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
