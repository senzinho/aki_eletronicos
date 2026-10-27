import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { UpdateBannerDto } from './dto/update-banner.dto.js';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    const now = new Date();
    return this.prisma.banner.findMany({
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
    return this.prisma.banner.findMany({ orderBy: { ordering: 'asc' } });
  }

  create(dto: CreateBannerDto) {
    return this.prisma.banner.create({ data: dto });
  }

  async update(id: number, dto: UpdateBannerDto) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Banner não encontrado.');
    return this.prisma.banner.update({ where: { id }, data: dto });
  }

  async updateImage(id: number, field: 'imageDesktop' | 'imageMobile', path: string) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Banner não encontrado.');
    return this.prisma.banner.update({ where: { id }, data: { [field]: path } });
  }

  async remove(id: number) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Banner não encontrado.');
    await this.prisma.banner.delete({ where: { id } });
    return { ok: true };
  }
}
