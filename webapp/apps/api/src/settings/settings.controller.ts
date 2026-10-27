import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { imageUploadOptions, publicUploadPath, videoUploadOptions } from '../common/upload.util.js';
import { SettingsService } from './settings.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

const IMAGE_KEYS = ['logo', 'favicon', 'og_image', 'hero_video_poster'];
const VIDEO_KEYS = ['hero_video'];

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateSettingsDto) {
    return this.service.updateMany(dto.values ?? {});
  }

  @Post('upload/:key')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', imageUploadOptions('site')))
  async uploadImage(@Param('key') key: string, @UploadedFile() file: Express.Multer.File) {
    if (!IMAGE_KEYS.includes(key)) {
      throw new BadRequestException('Campo de configuração inválido para upload de imagem.');
    }
    return this.service.setOne(key, publicUploadPath('site', file.filename));
  }

  @Post('upload-video/:key')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', videoUploadOptions('site')))
  async uploadVideo(@Param('key') key: string, @UploadedFile() file: Express.Multer.File) {
    if (!VIDEO_KEYS.includes(key)) {
      throw new BadRequestException('Campo de configuração inválido para upload de vídeo.');
    }
    return this.service.setOne(key, publicUploadPath('site', file.filename));
  }
}
