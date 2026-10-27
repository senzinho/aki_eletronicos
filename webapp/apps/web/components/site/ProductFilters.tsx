'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Drawer } from '../ui/Drawer';
import { buttonStyles } from '../ui/button-styles';
import type { Brand, Category } from '../../lib/types';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  hideCategory?: boolean;
  hideOnSale?: boolean;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name', label: 'Nome' },
];

export function ProductFilters({ categories, brands, hideCategory, hideOnSale }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string' && value.trim() !== '') params.set(key, value.trim());
    }
    router.push(`${pathname}?${params.toString()}`);
    setDrawerOpen(false);
  }

  function clearAll() {
    router.push(pathname);
    setDrawerOpen(false);
  }

  const defaults = {
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    brand: searchParams.get('brand') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    onSale: searchParams.get('onSale') === 'true',
    sort: searchParams.get('sort') ?? 'relevance',
  };

  const filterFields = (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-search" className="text-sm font-medium text-text">
          Buscar
        </label>
        <input
          id="f-search"
          name="search"
          defaultValue={defaults.search}
          placeholder="Nome, marca, modelo..."
          className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/70 focus-visible:outline-none focus-visible:border-aki-green-500"
        />
      </div>

      {!hideCategory && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-category" className="text-sm font-medium text-text">
            Categoria
          </label>
          <select
            id="f-category"
            name="category"
            defaultValue={defaults.category}
            className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-brand" className="text-sm font-medium text-text">
          Marca
        </label>
        <select
          id="f-brand"
          name="brand"
          defaultValue={defaults.brand}
          className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text"
        >
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-min" className="text-sm font-medium text-text">
            Preço mín.
          </label>
          <input
            id="f-min"
            name="minPrice"
            type="number"
            min={0}
            defaultValue={defaults.minPrice}
            className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-max" className="text-sm font-medium text-text">
            Preço máx.
          </label>
          <input
            id="f-max"
            name="maxPrice"
            type="number"
            min={0}
            defaultValue={defaults.maxPrice}
            className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text"
          />
        </div>
      </div>

      {!hideOnSale && (
        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            name="onSale"
            value="true"
            defaultChecked={defaults.onSale}
            className="h-4 w-4 rounded border-border accent-aki-green-500"
          />
          Somente ofertas
        </label>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-sort" className="text-sm font-medium text-text">
          Ordenar por
        </label>
        <select
          id="f-sort"
          name="sort"
          defaultValue={defaults.sort}
          className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className={buttonStyles('primary', 'md', 'flex-1')}>
          Aplicar filtros
        </button>
        <button type="button" onClick={clearAll} className={buttonStyles('ghost', 'md')}>
          Limpar
        </button>
      </div>
    </>
  );

  return (
    <>
      <form onSubmit={apply} className="hidden lg:flex lg:flex-col lg:gap-4 lg:w-64 lg:shrink-0">
        {filterFields}
      </form>

      <div className="lg:hidden mb-4">
        <button type="button" onClick={() => setDrawerOpen(true)} className={buttonStyles('secondary', 'sm')}>
          Filtrar e ordenar
        </button>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filtrar e ordenar">
        <form onSubmit={apply} className="flex flex-col gap-4">
          {filterFields}
        </form>
      </Drawer>
    </>
  );
}
