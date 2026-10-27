import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsObject()
  @IsOptional()
  values?: Record<string, string>;
}

export class UpdateSingleSettingDto {
  @IsString()
  value!: string;
}
