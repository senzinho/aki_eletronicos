import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.util.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { ordering: 'asc' },
    });
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { ordering: 'asc' } });
  }

  private async uniqueSlug(name: string, ignoreId?: number): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let suffix = 1;
    while (
      await this.prisma.category.findFirst({
        where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      })
    ) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
    return slug;
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.uniqueSlug(dto.name);
    return this.prisma.category.create({ data: { ...dto, slug } });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Categoria não encontrada.');

    const data: Record<string, unknown> = { ...dto };
    if (dto.name && dto.name !== existing.name) {
      data.slug = await this.uniqueSlug(dto.name, id);
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Categoria não encontrada.');
    await this.prisma.category.delete({ where: { id } });
    return { ok: true };
  }
}
