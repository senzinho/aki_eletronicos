import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';

const ALLOWED_IMAGE_MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const ALLOWED_VIDEO_MIME_EXT: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;

function buildUploadOptions(
  subdir: string,
  allowedMimeExt: Record<string, string>,
  maxBytes: number,
  invalidMessage: string,
): MulterOptions {
  const destDir = join(process.cwd(), 'uploads', subdir);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: destDir,
      filename: (_req, file, cb) => {
        const ext = allowedMimeExt[file.mimetype];
        if (!ext) {
          cb(new BadRequestException(invalidMessage), '');
          return;
        }
        cb(null, `${randomBytes(16).toString('hex')}.${ext}`);
      },
    }),
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeExt[file.mimetype]) {
        cb(new BadRequestException(invalidMessage), false);
        return;
      }
      cb(null, true);
    },
  };
}

export function imageUploadOptions(subdir: string): MulterOptions {
  return buildUploadOptions(
    subdir,
    ALLOWED_IMAGE_MIME_EXT,
    MAX_IMAGE_BYTES,
    'Imagem inválida. Envie JPG, PNG ou WebP de até 5MB.',
  );
}

export function videoUploadOptions(subdir: string): MulterOptions {
  return buildUploadOptions(
    subdir,
    ALLOWED_VIDEO_MIME_EXT,
    MAX_VIDEO_BYTES,
    'Vídeo inválido. Envie MP4 ou WebM de até 60MB.',
  );
}

export function publicUploadPath(subdir: string, filename: string): string {
  return `/uploads/${subdir}/${filename}`;
}
