import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { TrackEventDto } from './dto/track-event.dto.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('track')
  @HttpCode(200)
  track(@Body() dto: TrackEventDto) {
    return this.service.track(dto);
  }
}
