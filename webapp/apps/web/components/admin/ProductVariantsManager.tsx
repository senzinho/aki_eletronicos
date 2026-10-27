'use client';

import { useState, type FormEvent } from 'react';
import { ConfirmButton } from './ConfirmButton';
import { buttonStyles } from '../ui/button-styles';
import { products } from '../../lib/api';
import type { ProductVariant } from '../../lib/types';

interface ProductVariantsManagerProps {
  productId: number;
  variants: ProductVariant[];
  onChange: () => void;
}

export function ProductVariantsManager({ productId, variants, onChange }: ProductVariantsManagerProps) {
  const [adding, setAdding] = useState(false);

  async function addVariant(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await products.addVariant(productId, {
      color: String(form.get('color') ?? '') || undefined,
      storage: String(form.get('storage') ?? '') || undefined,
      priceOverride: form.get('priceOverride') ? Number(form.get('priceOverride')) : undefined,
      isAvailable: true,
    });
    setAdding(false);
    onChange();
  }

  async function toggleAvailable(variant: ProductVariant) {
    await products.updateVariant(variant.id, { isAvailable: !variant.isAvailable });
    onChange();
  }

  return (
    <div className="flex flex-col gap-3">
      {variants.length > 0 && (
        <div className="flex flex-col gap-2">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm">
              <span>
                {[v.color, v.storage].filter(Boolean).join(' · ') || 'Variante'}
                {v.priceOverride && <span className="text-text-muted"> — preço: R$ {v.priceOverride}</span>}
              </span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => toggleAvailable(v)} className="text-xs text-aki-green-400 hover:underline">
                  {v.isAvailable ? 'Disponível' : 'Indisponível'}
                </button>
                <ConfirmButton onConfirm={async () => { await products.removeVariant(v.id); onChange(); }}>Excluir</ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <form onSubmit={addVariant} className="flex flex-wrap items-end gap-2 rounded-xl border border-border bg-surface-1 p-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="v-color" className="text-xs text-text-muted">Cor</label>
            <input id="v-color" name="color" className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="v-storage" className="text-xs text-text-muted">Armazenamento</label>
            <input id="v-storage" name="storage" className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="v-price" className="text-xs text-text-muted">Preço (opcional)</label>
            <input id="v-price" name="priceOverride" type="number" step="0.01" className="w-28 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-sm" />
          </div>
          <button type="submit" className={buttonStyles('primary', 'sm')}>
            Adicionar
          </button>
          <button type="button" onClick={() => setAdding(false)} className={buttonStyles('ghost', 'sm')}>
            Cancelar
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className={buttonStyles('secondary', 'sm', 'self-start')}>
          + Nova variante
        </button>
      )}
    </div>
  );
}
