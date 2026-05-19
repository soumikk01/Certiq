import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionUser } from './auth.guard.js';

/**
 * @Session() parameter decorator — extracts the authenticated user
 * from the request context. Must be used with AuthGuard.
 *
 * Usage:
 *   @Get('me')
 *   getMe(@Session() user: SessionUser) { ... }
 */
export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SessionUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
