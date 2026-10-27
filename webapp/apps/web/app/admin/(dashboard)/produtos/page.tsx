'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { Badge } from '../../../../components/ui/Badge';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { formatPrice } from '../../../../lib/format';
import { products } from '../../../../lib/api';
import type { Product } from '../../../../lib/types';

export default function ProdutosAdminPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await products.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Produtos"
        action={
          <Link href="/admin/produtos/novo" className={buttonStyles('primary', 'sm')}>
            Novo produto
          </Link>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Nome', render: (p) => <Link href={`/admin/produtos/${p.id}`} className="font-medium hover:text-aki-green-400">{p.name}</Link> },
            { header: 'Marca', render: (p) => p.brand?.name ?? '—' },
            { header: 'Categoria', render: (p) => p.category?.name ?? '—' },
            { header: 'Preço', render: (p) => formatPrice(p.priceTo) },
            { header: 'Destaque', render: (p) => (p.isFeatured ? <Badge tone="green">Sim</Badge> : '—') },
            { header: 'Status', render: (p) => <Badge tone={p.status === 'published' ? 'green' : 'neutral'}>{p.status === 'published' ? 'Publicado' : 'Rascunho'}</Badge> },
            {
              header: 'Ações',
              render: (p) => (
                <div className="flex gap-3">
                  <Link href={`/admin/produtos/${p.id}`} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </Link>
                  <ConfirmButton onConfirm={async () => { await products.remove(p.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(p) => p.id}
        />
      )}
    </div>
  );
}
