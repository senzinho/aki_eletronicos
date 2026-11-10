import type { MetadataRoute } from 'next';
import { categories, products, settings } from '../lib/api';

// Needs a live API call; generate per-request instead of at build time
// (also avoids needing a reachable API during a Docker build).
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await settings.get();
  const base = s.app_url || 'http://localhost:3002';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/produtos`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ofertas`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/reparos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const [categoryList, productList] = await Promise.all([
    categories.list(),
    products.list({ pageSize: 48 }),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categoryList.map((c) => ({
    url: `${base}/categoria/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = productList.items.map((p) => ({
    url: `${base}/produto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
