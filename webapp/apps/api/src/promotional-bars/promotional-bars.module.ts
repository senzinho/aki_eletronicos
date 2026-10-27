import { Module } from '@nestjs/common';
import { PromotionalBarsController } from './promotional-bars.controller.js';
import { PromotionalBarsService } from './promotional-bars.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [PromotionalBarsController],
  providers: [PromotionalBarsService],
})
export class PromotionalBarsModule {}
