import type { Metadata } from 'next';
import { ProductFilters } from '../../../components/site/ProductFilters';
import { ProductResults } from '../../../components/site/ProductResults';
import { brands, categories, products, settings } from '../../../lib/api';
import { parseProductQuery, type SearchParams } from '../../../lib/parse-product-query';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Explore o catálogo completo de smartphones e acessórios da Aki Eletrônicos.',
  alternates: { canonical: '/produtos' },
  openGraph: {
    title: 'Produtos',
    description: 'Explore o catálogo completo de smartphones e acessórios da Aki Eletrônicos.',
  },
};

export default async function ProdutosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const query = parseProductQuery(sp);

  const [result, categoryList, brandList, s] = await Promise.all([
    products.list(query),
    categories.list(),
    brands.list(),
    settings.get(),
  ]);

  const hasActiveFilters = Boolean(
    query.search || query.category || query.brand || query.minPrice || query.maxPrice || query.onSale,
  );

  function buildPageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key !== 'page' && typeof value === 'string' && value) params.set(key, value);
    }
    params.set('page', String(page));
    return `/produtos?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold mb-8">Produtos</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductFilters categories={categoryList} brands={brandList} />
        <ProductResults
          items={result.items}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
          whatsappNumber={s.whatsapp || '5541998132536'}
          siteUrl={s.app_url || 'http://localhost:3002'}
          hasActiveFilters={hasActiveFilters}
          buildPageHref={buildPageHref}
        />
      </div>
    </div>
  );
}
