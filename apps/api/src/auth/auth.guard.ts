import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * AuthGuard — validates InsForge JWT access tokens.
 *
 * Extracts the Bearer token from the Authorization header,
 * verifies it against the InsForge API, and attaches the user
 * to the request object.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly insforgeUrl: string;

  constructor(private readonly config: ConfigService) {
    this.insforgeUrl =
      config.get<string>('INSFORGE_URL') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      // Validate token by calling InsForge's user endpoint
      const response = await fetch(`${this.insforgeUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const data = await response.json() as any;
      // Attach user info to request
      (request as any).user = {
        id: data.id,
        email: data.email,
        name: data.profile?.name ?? null,
        avatarUrl: data.profile?.avatar_url ?? null,
        provider: data.providers?.[0] ?? 'email',
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (!auth) return null;
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token ?? null : null;
  }
}
