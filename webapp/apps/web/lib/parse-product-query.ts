import type { ProductQuery } from './api';

export type SearchParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseProductQuery(searchParams: SearchParams, overrides: Partial<ProductQuery> = {}): ProductQuery {
  const sort = str(searchParams.sort);
  const page = str(searchParams.page);
  const minPrice = str(searchParams.minPrice);
  const maxPrice = str(searchParams.maxPrice);

  return {
    search: str(searchParams.search) || undefined,
    category: str(searchParams.category) || undefined,
    brand: str(searchParams.brand) || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    onSale: str(searchParams.onSale) === 'true' || undefined,
    sort: (sort as ProductQuery['sort']) || undefined,
    page: page ? Number(page) : 1,
    pageSize: 12,
    ...overrides,
  };
}
