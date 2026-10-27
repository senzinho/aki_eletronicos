'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '../../../../../components/admin/PageHeader';
import { ImageUploadField } from '../../../../../components/admin/ImageUploadField';
import { ProductImagesManager } from '../../../../../components/admin/ProductImagesManager';
import { ProductVariantsManager } from '../../../../../components/admin/ProductVariantsManager';
import { ProductForm } from '../../../../../components/admin/ProductForm';
import { Card } from '../../../../../components/ui/Card';
import { brands, categories, products } from '../../../../../lib/api';
import type { Brand, Category, Product } from '../../../../../lib/types';

export default function EditarProdutoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const [p, b, c] = await Promise.all([products.getAdmin(id), brands.listAdmin(), categories.listAdmin()]);
    setProduct(p);
    setBrandList(b);
    setCategoryList(c);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!product) return null;

  return (
    <div>
      <PageHeader title={product.name} description="Editar produto" />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <ProductForm
            brands={brandList}
            categories={categoryList}
            product={product}
            submitLabel="Salvar alterações"
            onSubmit={async (data) => {
              await products.update(id, data);
              await load();
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          />
          {saved && <p className="mt-3 text-sm text-aki-green-400">Alterações salvas.</p>}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-heading text-sm font-semibold mb-4">Imagem principal</h3>
            <ImageUploadField
              label="Imagem principal"
              currentUrl={product.mainImage}
              onUpload={async (file) => {
                await products.uploadMainImage(id, file);
                await load();
              }}
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-heading text-sm font-semibold mb-4">Galeria</h3>
            <ProductImagesManager productId={id} images={product.images} onChange={load} />
          </Card>

          <Card className="p-6">
            <h3 className="font-heading text-sm font-semibold mb-1">Variantes</h3>
            <p className="text-xs text-text-muted mb-4">Cor e/ou armazenamento, exibidos como seletores na página do produto.</p>
            <ProductVariantsManager productId={id} variants={product.variants ?? []} onChange={load} />
          </Card>

          <button type="button" onClick={() => router.push('/admin/produtos')} className="text-sm text-text-muted hover:text-text self-start">
            ← Voltar para produtos
          </button>
        </div>
      </div>
    </div>
  );
}
