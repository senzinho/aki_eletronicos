'use client';

import type { FormEvent } from 'react';
import { Input, Select, Textarea } from '../ui/Field';
import { buttonStyles } from '../ui/button-styles';
import type { Brand, Category, Product } from '../../lib/types';

interface ProductFormProps {
  brands: Brand[];
  categories: Category[];
  product?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export function ProductForm({ brands, categories, product, onSubmit, submitLabel }: ProductFormProps) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const num = (key: string) => {
      const v = form.get(key);
      return v && String(v).trim() !== '' ? Number(v) : undefined;
    };
    const data = {
      name: String(form.get('name') ?? ''),
      subtitle: String(form.get('subtitle') ?? '') || undefined,
      description: String(form.get('description') ?? '') || undefined,
      brandId: num('brandId'),
      categoryId: num('categoryId'),
      priceFrom: num('priceFrom'),
      priceTo: num('priceTo') ?? 0,
      pricePix: num('pricePix'),
      installmentMax: num('installmentMax'),
      installmentInterestFree: form.get('installmentInterestFree') === 'on',
      installmentNote: String(form.get('installmentNote') ?? '') || undefined,
      badge: String(form.get('badge') ?? '') || undefined,
      isFeatured: form.get('isFeatured') === 'on',
      status: String(form.get('status') ?? 'published'),
      ordering: num('ordering') ?? 0,
      seoTitle: String(form.get('seoTitle') ?? '') || undefined,
      seoDescription: String(form.get('seoDescription') ?? '') || undefined,
    };
    await onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="name" name="name" label="Nome" required defaultValue={product?.name} />
      <Input id="subtitle" name="subtitle" label="Subtítulo" defaultValue={product?.subtitle ?? ''} />
      <Textarea id="description" name="description" label="Descrição" rows={5} defaultValue={product?.description ?? ''} />

      <div className="grid grid-cols-2 gap-4">
        <Select id="brandId" name="brandId" label="Marca" defaultValue={product?.brandId ?? ''}>
          <option value="">—</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
        <Select id="categoryId" name="categoryId" label="Categoria" defaultValue={product?.categoryId ?? ''}>
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="priceFrom" name="priceFrom" label="Preço anterior (oferta, opcional)" type="number" step="0.01" min={0} defaultValue={product?.priceFrom ?? ''} />
        <Input id="priceTo" name="priceTo" label="Preço atual" type="number" step="0.01" min={0} required defaultValue={product?.priceTo ?? ''} />
      </div>

      <Input id="pricePix" name="pricePix" label="Preço à vista no Pix (opcional)" type="number" step="0.01" min={0} defaultValue={product?.pricePix ?? ''} hint="Se vazio, usa o preço atual." />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="installmentMax"
          name="installmentMax"
          label="Parcelas (máx.)"
          type="number"
          min={1}
          max={18}
          placeholder="18"
          hint="Se vazio, usa o padrão da loja: até 18x."
          defaultValue={product?.installmentMax ?? ''}
        />
        <label className="flex items-center gap-2 text-sm text-text mt-6">
          <input type="checkbox" name="installmentInterestFree" defaultChecked={product?.installmentInterestFree ?? true} className="h-4 w-4 accent-aki-green-500" />
          Parcelamento sem juros
        </label>
      </div>
      <Input id="installmentNote" name="installmentNote" label="Observação do parcelamento (opcional)" defaultValue={product?.installmentNote ?? ''} />

      <div className="grid grid-cols-2 gap-4">
        <Input id="badge" name="badge" label="Selo (ex: Novo, Pix, Oferta)" defaultValue={product?.badge ?? ''} />
        <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={product?.ordering ?? 0} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select id="status" name="status" label="Status" defaultValue={product?.status ?? 'published'}>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-text mt-6">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="h-4 w-4 accent-aki-green-500" />
          Produto em destaque
        </label>
      </div>

      <div className="border-t border-border pt-4 flex flex-col gap-4">
        <h3 className="font-heading text-sm font-semibold">SEO</h3>
        <Input id="seoTitle" name="seoTitle" label="Título SEO" defaultValue={product?.seoTitle ?? ''} />
        <Input id="seoDescription" name="seoDescription" label="Descrição SEO" defaultValue={product?.seoDescription ?? ''} />
      </div>

      <button type="submit" className={buttonStyles('primary', 'md', 'self-start')}>
        {submitLabel}
      </button>
    </form>
  );
}
