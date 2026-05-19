import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { getAuth } from './auth.js';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: 'AUTH_INSTANCE',
      useFactory: () => getAuth(),
    },
  ],
  exports: ['AUTH_INSTANCE'],
})
export class AuthModule {}
