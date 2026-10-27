import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SocialLinksService } from './social-links.service.js';
import { CreateSocialLinkDto } from './dto/create-social-link.dto.js';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto.js';

@Controller('social-links')
export class SocialLinksController {
  constructor(private readonly service: SocialLinksService) {}

  @Get()
  findPublic() {
    return this.service.findPublic();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateSocialLinkDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSocialLinkDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
