'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '../../../../../components/admin/PageHeader';
import { Card } from '../../../../../components/ui/Card';
import { ProductForm } from '../../../../../components/admin/ProductForm';
import { brands, categories, products } from '../../../../../lib/api';
import type { Brand, Category } from '../../../../../lib/types';

export default function NovoProdutoPage() {
  const router = useRouter();
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    brands.listAdmin().then(setBrandList);
    categories.listAdmin().then(setCategoryList);
  }, []);

  return (
    <div>
      <PageHeader title="Novo produto" description="Depois de criar, você poderá adicionar galeria de fotos e variantes." />
      <Card className="max-w-2xl p-6">
        <ProductForm
          brands={brandList}
          categories={categoryList}
          submitLabel="Criar produto"
          onSubmit={async (data) => {
            const created = await products.create(data);
            router.push(`/admin/produtos/${created.id}`);
          }}
        />
      </Card>
    </div>
  );
}
