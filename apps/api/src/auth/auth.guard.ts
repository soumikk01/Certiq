import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { getAuth } from './auth.js';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export class SessionUser {
  id!: string;
  email!: string;
  name!: string | null;
  avatarUrl!: string | null;
  createdAt!: Date;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const auth = await getAuth();
    const { fromNodeHeaders } = await import('better-auth/node');

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    (request as any).user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
      avatarUrl: session.user.image ?? null,
      createdAt: session.user.createdAt,
    };
    (request as any).session = session.session;

    return true;
  }
}
