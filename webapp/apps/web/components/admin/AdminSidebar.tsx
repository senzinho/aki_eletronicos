'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { auth } from '../../lib/api';
import type { AdminInfo } from '../../lib/types';

const NAV = [
  { href: '/admin', label: 'Visão geral', exact: true },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/marcas', label: 'Marcas' },
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/promocoes', label: 'Barra promocional' },
  { href: '/admin/depoimentos', label: 'Depoimentos' },
  { href: '/admin/links-sociais', label: 'Redes sociais' },
  { href: '/admin/solicitacoes', label: 'Solicitações' },
  { href: '/admin/configuracoes', label: 'Configurações' },
  { href: '/admin/integracoes', label: 'Integrações' },
];

export function AdminSidebar({ admin }: { admin: AdminInfo }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await auth.logout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface-1 p-4">
      <div className="mb-6 px-2">
        <span className="font-heading text-base font-bold">Aki Eletrônicos</span>
        <p className="text-xs text-text-muted">Painel administrativo</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-aki-green-500/15 text-aki-green-400' : 'text-text-muted hover:bg-surface-2 hover:text-text',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-3 mt-3">
        <p className="px-2 text-xs text-text-muted mb-2">{admin.name}</p>
        <div className="flex flex-col gap-1">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-2 hover:text-text">
            Ver site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-2 hover:text-danger"
          >
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
