import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum ServiceRequestTypeDto {
  reparo = 'reparo',
  contato = 'contato',
}

export class CreateServiceRequestDto {
  @IsEnum(ServiceRequestTypeDto)
  type!: ServiceRequestTypeDto;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  deviceModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  problemType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
