import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getAuth } from './auth.js';
import { Public } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  private handlerPromise: Promise<(req: any, res: any) => void>;

  constructor() {
    this.handlerPromise = this.initHandler();
  }

  private async initHandler() {
    const auth = await getAuth();
    const { toNodeHandler } = await import('better-auth/node');
    return toNodeHandler(auth);
  }

  @All('*splat')
  @Public()
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const handler = await this.handlerPromise;
    return handler(req, res);
  }
}
