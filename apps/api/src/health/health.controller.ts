import { Controller, Get } from '@nestjs/common';

/**
 * Health check endpoint.
 *
 * Proves the monorepo wires together by exposing a single `GET /health`
 * route that returns a static payload with the default HTTP 200 status
 * (Requirement 21.5). The landing page does not consume this endpoint;
 * it exists purely as a build/runtime smoke signal.
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' as const };
  }
}
