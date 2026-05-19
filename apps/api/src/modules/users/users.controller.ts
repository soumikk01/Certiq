import { Controller, Get } from '@nestjs/common';
import { Session } from '../../common/decorators/current-user.decorator.js';
import type { SessionUser } from '../../common/guards/auth.guard.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Session() user: SessionUser) {
    return this.usersService.findById(user.id);
  }
}
