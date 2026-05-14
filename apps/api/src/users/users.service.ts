import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface InsForgeUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Upsert user from InsForge auth data.
   * Creates the user if they don't exist, updates if they do.
   */
  async syncUser(insforgeUser: InsForgeUser) {
    return this.prisma.user.upsert({
      where: { id: insforgeUser.id },
      update: {
        email: insforgeUser.email,
        name: insforgeUser.name,
        avatarUrl: insforgeUser.avatarUrl,
        provider: insforgeUser.provider,
      },
      create: {
        id: insforgeUser.id,
        email: insforgeUser.email,
        name: insforgeUser.name,
        avatarUrl: insforgeUser.avatarUrl,
        provider: insforgeUser.provider,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
