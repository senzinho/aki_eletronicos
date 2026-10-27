'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  ExternalLink,
  Images,
  LayoutGrid,
  LogOut,
  MessageSquareText,
  Package,
  Plug,
  Settings,
  Share2,
  Sparkles,
  Tags,
} from 'lucide-react';
import { auth } from '../../lib/api';
import type { AdminInfo } from '../../lib/types';

const NAV = [
  { href: '/admin', label: 'Visão geral', exact: true, icon: LayoutGrid },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/marcas', label: 'Marcas', icon: Tags },
  { href: '/admin/categorias', label: 'Categorias', icon: LayoutGrid },
  { href: '/admin/banners', label: 'Banners', icon: Images },
  { href: '/admin/promocoes', label: 'Barra promocional', icon: Sparkles },
  { href: '/admin/depoimentos', label: 'Depoimentos', icon: MessageSquareText },
  { href: '/admin/links-sociais', label: 'Redes sociais', icon: Share2 },
  { href: '/admin/solicitacoes', label: 'Solicitações', icon: MessageSquareText },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/admin/integracoes', label: 'Integrações', icon: Plug },
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
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-aki-green-500/15 text-aki-green-400' : 'text-text-muted hover:bg-surface-2 hover:text-text',
              )}
            >
              <Icon size={16} strokeWidth={1.8} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-3 mt-3">
        <p className="px-2 text-xs text-text-muted mb-2">{admin.name}</p>
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ExternalLink size={15} strokeWidth={1.8} />
            Ver site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-danger"
          >
            <LogOut size={15} strokeWidth={1.8} />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
