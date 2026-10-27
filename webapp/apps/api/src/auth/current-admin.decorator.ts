import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AdminJwtPayload } from './auth.service.js';

export const CurrentAdmin = createParamDecorator((_: unknown, ctx: ExecutionContext): AdminJwtPayload => {
  const req = ctx.switchToHttp().getRequest<Request & { admin: AdminJwtPayload }>();
  return req.admin;
});
