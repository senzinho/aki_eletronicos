'use client';

import Image from 'next/image';
import { assetUrl } from '../../lib/asset-url';
import { products } from '../../lib/api';
import type { ProductImage } from '../../lib/types';

interface ProductImagesManagerProps {
  productId: number;
  images: ProductImage[];
  onChange: () => void;
}

export function ProductImagesManager({ productId, images, onChange }: ProductImagesManagerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img) => {
          const src = assetUrl(img.image);
          return (
            <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-surface-1">
              {src && <Image src={src} alt="" fill className="object-contain p-1.5" />}
              <button
                type="button"
                onClick={async () => {
                  await products.removeImage(img.id);
                  onChange();
                }}
                aria-label="Remover imagem"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
              >
                ×
              </button>
            </div>
          );
        })}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border text-xs text-text-muted hover:border-aki-green-500 hover:text-text">
          + Adicionar
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await products.addImage(productId, file);
              onChange();
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
