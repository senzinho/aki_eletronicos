import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePromotionalBarDto } from './dto/create-promotional-bar.dto.js';
import { UpdatePromotionalBarDto } from './dto/update-promotional-bar.dto.js';

@Injectable()
export class PromotionalBarsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    const now = new Date();
    return this.prisma.promotionalBar.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { ordering: 'asc' },
    });
  }

  findAll() {
    return this.prisma.promotionalBar.findMany({ orderBy: { ordering: 'asc' } });
  }

  create(dto: CreatePromotionalBarDto) {
    return this.prisma.promotionalBar.create({ data: dto });
  }

  async update(id: number, dto: UpdatePromotionalBarDto) {
    const existing = await this.prisma.promotionalBar.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Barra promocional não encontrada.');
    return this.prisma.promotionalBar.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.promotionalBar.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Barra promocional não encontrada.');
    await this.prisma.promotionalBar.delete({ where: { id } });
    return { ok: true };
  }
}
