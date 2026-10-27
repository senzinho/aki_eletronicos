import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export enum AnalyticsEventTypeDto {
  page_view = 'page_view',
  product_view = 'product_view',
  whatsapp_click = 'whatsapp_click',
  banner_click = 'banner_click',
}

export class TrackEventDto {
  @IsEnum(AnalyticsEventTypeDto)
  eventType!: AnalyticsEventTypeDto;

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  bannerId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  page?: string;
}
