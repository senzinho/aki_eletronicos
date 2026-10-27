import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSocialLinkDto } from './dto/create-social-link.dto.js';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto.js';

@Injectable()
export class SocialLinksService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.socialLink.findMany({ where: { isActive: true } });
  }

  findAll() {
    return this.prisma.socialLink.findMany();
  }

  create(dto: CreateSocialLinkDto) {
    return this.prisma.socialLink.create({ data: dto });
  }

  async update(id: number, dto: UpdateSocialLinkDto) {
    const existing = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Link não encontrado.');
    return this.prisma.socialLink.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const existing = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Link não encontrado.');
    await this.prisma.socialLink.delete({ where: { id } });
    return { ok: true };
  }
}
