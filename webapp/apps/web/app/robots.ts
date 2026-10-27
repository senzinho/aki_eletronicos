import type { MetadataRoute } from 'next';
import { settings } from '../lib/api';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await settings.get();
  const base = s.app_url || 'http://localhost:3002';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
