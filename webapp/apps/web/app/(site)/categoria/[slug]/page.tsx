import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductFilters } from '../../../../components/site/ProductFilters';
import { ProductResults } from '../../../../components/site/ProductResults';
import { brands, categories, products, settings } from '../../../../lib/api';
import { parseProductQuery, type SearchParams } from '../../../../lib/parse-product-query';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryList = await categories.list();
  const category = categoryList.find((c) => c.slug === slug);
  if (!category) return {};
  const description = `Confira os produtos da categoria ${category.name} na Aki Eletrônicos.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: { title: category.name, description },
  };
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const categoryList = await categories.list();
  const category = categoryList.find((c) => c.slug === slug);
  if (!category) notFound();

  const query = parseProductQuery(sp, { category: slug });

  const [result, brandList, s] = await Promise.all([products.list(query), brands.list(), settings.get()]);

  function buildPageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key !== 'page' && key !== 'category' && typeof value === 'string' && value) params.set(key, value);
    }
    params.set('page', String(page));
    return `/categoria/${slug}?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold mb-8">{category.name}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductFilters categories={categoryList} brands={brandList} hideCategory />
        <ProductResults
          items={result.items}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
          whatsappNumber={s.whatsapp || '5541998132536'}
          siteUrl={s.app_url || 'http://localhost:3002'}
          hasActiveFilters={Boolean(query.search || query.brand || query.minPrice || query.maxPrice || query.onSale)}
          buildPageHref={buildPageHref}
        />
      </div>
    </div>
  );
}
