import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller.js';
import { BannersService } from './banners.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
