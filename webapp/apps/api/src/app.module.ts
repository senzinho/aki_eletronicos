import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { ProductsModule } from './products/products.module.js';
import { BannersModule } from './banners/banners.module.js';
import { PromotionalBarsModule } from './promotional-bars/promotional-bars.module.js';
import { SocialLinksModule } from './social-links/social-links.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { TestimonialsModule } from './testimonials/testimonials.module.js';
import { ServiceRequestsModule } from './service-requests/service-requests.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    BannersModule,
    PromotionalBarsModule,
    SocialLinksModule,
    SettingsModule,
    TestimonialsModule,
    ServiceRequestsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
