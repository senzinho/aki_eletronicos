import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceRequestDto } from './dto/create-service-request.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateServiceRequestDto) {
    return this.prisma.serviceRequest.create({ data: dto });
  }

  findAll() {
    return this.prisma.serviceRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const existing = await this.prisma.serviceRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Solicitação não encontrada.');
    return this.prisma.serviceRequest.update({ where: { id }, data: { status: dto.status } });
  }
}
