import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';

export interface AdminJwtPayload {
  sub: number;
  username: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateAndLogin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    const passwordOk = await compare(password, admin.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: AdminJwtPayload = {
      sub: admin.id,
      username: admin.username,
      name: admin.name,
    };
    const token = await this.jwt.signAsync(payload);

    return {
      token,
      admin: { id: admin.id, username: admin.username, name: admin.name, email: admin.email },
    };
  }
}
