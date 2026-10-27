import { IsEnum } from 'class-validator';

export enum ServiceRequestStatusDto {
  novo = 'novo',
  em_andamento = 'em_andamento',
  concluido = 'concluido',
}

export class UpdateStatusDto {
  @IsEnum(ServiceRequestStatusDto)
  status!: ServiceRequestStatusDto;
}
