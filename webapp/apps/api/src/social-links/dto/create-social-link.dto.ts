import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  platform!: string;

  @IsUrl()
  @MaxLength(255)
  url!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
