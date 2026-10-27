import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import type { Product } from '../../lib/types';

interface ProductResultsProps {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  whatsappNumber: string;
  siteUrl: string;
  hasActiveFilters: boolean;
  buildPageHref: (page: number) => string;
}

export function ProductResults({
  items,
  total,
  page,
  totalPages,
  whatsappNumber,
  siteUrl,
  hasActiveFilters,
  buildPageHref,
}: ProductResultsProps) {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-1 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-text">
          {hasActiveFilters ? 'Nenhum resultado encontrado' : 'Nenhum produto disponível no momento'}
        </p>
        <p className="text-sm text-text-muted max-w-sm">
          {hasActiveFilters
            ? 'Tente ajustar os filtros ou buscar por outro termo.'
            : 'Em breve novos produtos serão adicionados ao catálogo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="text-sm text-text-muted mb-5">{total} produto{total === 1 ? '' : 's'} encontrado{total === 1 ? '' : 's'}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} buildHref={buildPageHref} />
    </div>
  );
}
