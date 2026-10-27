import type { Metadata } from 'next';
import { ProductFilters } from '../../../components/site/ProductFilters';
import { ProductResults } from '../../../components/site/ProductResults';
import { brands, categories, products, settings } from '../../../lib/api';
import { parseProductQuery, type SearchParams } from '../../../lib/parse-product-query';

export const metadata: Metadata = {
  title: 'Ofertas',
  description: 'Confira as ofertas ativas em smartphones e acessórios na Aki Eletrônicos.',
};

export default async function OfertasPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const query = parseProductQuery(sp, { onSale: true });

  const [result, categoryList, brandList, s] = await Promise.all([
    products.list(query),
    categories.list(),
    brands.list(),
    settings.get(),
  ]);

  function buildPageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key !== 'page' && key !== 'onSale' && typeof value === 'string' && value) params.set(key, value);
    }
    params.set('page', String(page));
    return `/ofertas?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold mb-2">Ofertas que merecem sua atenção</h1>
      <p className="text-text-muted mb-8">Descontos reais, calculados a partir do preço anterior cadastrado.</p>
      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductFilters categories={categoryList} brands={brandList} hideOnSale />
        <ProductResults
          items={result.items}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
          whatsappNumber={s.whatsapp || '5541998132536'}
          siteUrl={s.app_url || 'http://localhost:3002'}
          hasActiveFilters={true}
          buildPageHref={buildPageHref}
        />
      </div>
    </div>
  );
}
