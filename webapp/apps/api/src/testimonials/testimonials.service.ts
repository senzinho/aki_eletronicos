import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTestimonialDto } from './dto/create-testimonial.dto.js';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto.js';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { ordering: 'asc' },
    });
  }

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { ordering: 'asc' } });
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  async update(id: number, dto: UpdateTestimonialDto) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Depoimento não encontrado.');
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Depoimento não encontrado.');
    await this.prisma.testimonial.delete({ where: { id } });
    return { ok: true };
  }
}
