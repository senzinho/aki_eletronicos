import Link from 'next/link';
import { Card } from '../../../components/ui/Card';
import { PageHeader } from '../../../components/admin/PageHeader';
import { brands, categories, products, serviceRequests } from '../../../lib/api';

export default async function AdminDashboardPage() {
  const [productList, brandList, categoryList, requests] = await Promise.all([
    products.listAdmin(),
    brands.listAdmin(),
    categories.listAdmin(),
    serviceRequests.list(),
  ]);

  const pendingRequests = requests.filter((r) => r.status === 'novo').length;

  const cards = [
    { label: 'Produtos cadastrados', value: productList.length, href: '/admin/produtos' },
    { label: 'Marcas', value: brandList.length, href: '/admin/marcas' },
    { label: 'Categorias', value: categoryList.length, href: '/admin/categorias' },
    { label: 'Solicitações novas', value: pendingRequests, href: '/admin/solicitacoes' },
  ];

  return (
    <div>
      <PageHeader title="Visão geral" description="Resumo rápido do catálogo e das solicitações recebidas." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="p-5 hover:border-aki-green-500/60">
              <p className="text-sm text-text-muted mb-1">{c.label}</p>
              <p className="font-heading text-3xl font-bold text-text">{c.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
