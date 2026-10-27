import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AdminJwtPayload } from './auth.service.js';

export const ADMIN_TOKEN_COOKIE = 'aki_admin_token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.[ADMIN_TOKEN_COOKIE];
    if (!token) {
      throw new UnauthorizedException('Sessão não encontrada.');
    }
    try {
      const payload = await this.jwt.verifyAsync<AdminJwtPayload>(token);
      (req as Request & { admin: AdminJwtPayload }).admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sessão expirada.');
    }
  }
}
