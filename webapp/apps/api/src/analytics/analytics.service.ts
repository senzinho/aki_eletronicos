import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrackEventDto } from './dto/track-event.dto.js';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async track(dto: TrackEventDto) {
    try {
      await this.prisma.analyticsEvent.create({
        data: {
          eventType: dto.eventType,
          productId: dto.productId,
          bannerId: dto.bannerId,
          page: dto.page,
        },
      });
    } catch (err) {
      // Falha em analytics não deve quebrar a navegação do usuário.
      this.logger.warn(`Falha ao registrar evento de analytics: ${(err as Error).message}`);
    }
    return { ok: true };
  }
}
