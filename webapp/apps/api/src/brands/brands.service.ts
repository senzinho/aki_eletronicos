import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.util.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { ordering: 'asc' },
    });
  }

  findAll() {
    return this.prisma.brand.findMany({ orderBy: { ordering: 'asc' } });
  }

  private async uniqueSlug(name: string, ignoreId?: number): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let suffix = 1;
    while (
      await this.prisma.brand.findFirst({
        where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      })
    ) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
    return slug;
  }

  async create(dto: CreateBrandDto) {
    const slug = await this.uniqueSlug(dto.name);
    return this.prisma.brand.create({ data: { ...dto, slug } });
  }

  async update(id: number, dto: UpdateBrandDto) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Marca não encontrada.');

    const data: Record<string, unknown> = { ...dto };
    if (dto.name && dto.name !== existing.name) {
      data.slug = await this.uniqueSlug(dto.name, id);
    }
    return this.prisma.brand.update({ where: { id }, data });
  }

  async updateLogo(id: number, logoPath: string) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Marca não encontrada.');
    return this.prisma.brand.update({ where: { id }, data: { logo: logoPath } });
  }

  async remove(id: number) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Marca não encontrada.');
    await this.prisma.brand.delete({ where: { id } });
    return { ok: true };
  }
}
