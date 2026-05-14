import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me — Get or sync current user profile.
   * Called by the dashboard on load to ensure the user exists in our DB.
   */
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const dbUser = await this.usersService.syncUser(user);
    return dbUser;
  }
}
