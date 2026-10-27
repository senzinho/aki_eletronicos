import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVariantDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  storage?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceOverride?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ordering?: number;
}

export class UpdateVariantDto extends CreateVariantDto {}
