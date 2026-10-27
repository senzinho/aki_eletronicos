import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.settingKey, r.settingValue ?? '']));
  }

  async updateMany(values: Record<string, string>) {
    await this.prisma.$transaction(
      Object.entries(values).map(([key, value]) =>
        this.prisma.siteSetting.upsert({
          where: { settingKey: key },
          update: { settingValue: value },
          create: { settingKey: key, settingValue: value },
        }),
      ),
    );
    return this.getAll();
  }

  async setOne(key: string, value: string) {
    await this.prisma.siteSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: { settingKey: key, settingValue: value },
    });
    return this.getAll();
  }
}
