import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PromotionalBarsService } from './promotional-bars.service.js';
import { CreatePromotionalBarDto } from './dto/create-promotional-bar.dto.js';
import { UpdatePromotionalBarDto } from './dto/update-promotional-bar.dto.js';

@Controller('promotional-bars')
export class PromotionalBarsController {
  constructor(private readonly service: PromotionalBarsService) {}

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
  create(@Body() dto: CreatePromotionalBarDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePromotionalBarDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
