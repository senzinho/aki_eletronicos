import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.util.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto.js';

const PUBLIC_INCLUDE = {
  brand: true,
  category: true,
  images: { orderBy: { ordering: 'asc' as const } },
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(query: QueryProductDto) {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 12, 48);

    const where: Prisma.ProductWhereInput = {
      status: 'published',
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.brand ? { brand: { slug: query.brand } } : {}),
      ...(query.featured ? { isFeatured: true } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search } },
              { subtitle: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            priceTo: {
              ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
              ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
            },
          }
        : {}),
      ...(query.onSale ? { priceFrom: { not: null } } : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === 'price_asc'
        ? [{ priceTo: 'asc' }]
        : query.sort === 'price_desc'
          ? [{ priceTo: 'desc' }]
          : query.sort === 'name'
            ? [{ name: 'asc' }]
            : [{ ordering: 'asc' }, { createdAt: 'desc' }];

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: PUBLIC_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'published' },
      include: {
        ...PUBLIC_INCLUDE,
        variants: { orderBy: { ordering: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    const related = await this.prisma.product.findMany({
      where: {
        status: 'published',
        id: { not: product.id },
        OR: [
          product.brandId ? { brandId: product.brandId } : undefined,
          product.categoryId ? { categoryId: product.categoryId } : undefined,
        ].filter(Boolean) as Prisma.ProductWhereInput[],
      },
      include: PUBLIC_INCLUDE,
      take: 4,
    });

    return { product, related };
  }

  findAllAdmin() {
    return this.prisma.product.findMany({
      orderBy: [{ ordering: 'asc' }, { createdAt: 'desc' }],
      include: { brand: true, category: true },
    });
  }

  async findOneAdmin(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { ordering: 'asc' } },
        variants: { orderBy: { ordering: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');
    return product;
  }

  private async uniqueSlug(name: string, ignoreId?: number): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let suffix = 1;
    while (
      await this.prisma.product.findFirst({
        where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      })
    ) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
    return slug;
  }

  async create(dto: CreateProductDto) {
    const slug = await this.uniqueSlug(dto.name);
    return this.prisma.product.create({ data: { ...dto, slug } });
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Produto não encontrado.');

    const data: Record<string, unknown> = { ...dto };
    if (dto.name && dto.name !== existing.name) {
      data.slug = await this.uniqueSlug(dto.name, id);
    }
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Produto não encontrado.');
    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }

  async updateMainImage(id: number, path: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Produto não encontrado.');
    return this.prisma.product.update({ where: { id }, data: { mainImage: path } });
  }

  async addImage(productId: number, path: string) {
    const existing = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new NotFoundException('Produto não encontrado.');
    const count = await this.prisma.productImage.count({ where: { productId } });
    return this.prisma.productImage.create({
      data: { productId, image: path, ordering: count },
    });
  }

  async removeImage(imageId: number) {
    const existing = await this.prisma.productImage.findUnique({ where: { id: imageId } });
    if (!existing) throw new NotFoundException('Imagem não encontrada.');
    await this.prisma.productImage.delete({ where: { id: imageId } });
    return { ok: true };
  }

  async addVariant(productId: number, dto: CreateVariantDto) {
    const existing = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new NotFoundException('Produto não encontrado.');
    return this.prisma.productVariant.create({ data: { ...dto, productId } });
  }

  async updateVariant(variantId: number, dto: UpdateVariantDto) {
    const existing = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException('Variante não encontrada.');
    return this.prisma.productVariant.update({ where: { id: variantId }, data: dto });
  }

  async removeVariant(variantId: number) {
    const existing = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException('Variante não encontrada.');
    await this.prisma.productVariant.delete({ where: { id: variantId } });
    return { ok: true };
  }
}
