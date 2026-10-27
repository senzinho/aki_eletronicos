'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Logo } from './Logo';
import { buttonStyles } from '../ui/button-styles';
import { useCartStore } from '../../lib/cart-store';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';
import { CartDrawer } from './CartDrawer';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/ofertas', label: 'Ofertas' },
  { href: '/reparos', label: 'Assistência técnica' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
];

interface HeaderClientProps {
  companyName: string;
  logoPath: string | null;
  whatsappNumber: string;
}

export function HeaderClient({ companyName, logoPath, whatsappNumber }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const whatsappHref = buildWhatsAppLink(
    whatsappNumber,
    'Olá! Vim pelo site e gostaria de saber mais informações.',
  );

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(search.trim() ? `/produtos?search=${encodeURIComponent(search.trim())}` : '/produtos');
  }

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b transition-colors duration-200',
        scrolled ? 'border-border bg-bg/90 backdrop-blur-md' : 'border-transparent bg-bg',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <Logo logoPath={logoPath} companyName={companyName} />

        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-aki-green-400',
                pathname === link.href ? 'text-aki-green-400' : 'text-text-muted',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xs ml-auto items-center">
          <label htmlFor="header-search" className="sr-only">
            Pesquisar produtos
          </label>
          <input
            id="header-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2 text-sm text-text placeholder:text-text-muted/70 focus-visible:outline-none focus-visible:border-aki-green-500 focus-visible:ring-2 focus-visible:ring-aki-green-500/30"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir seleção de produtos (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`}
            className="relative rounded-xl p-2.5 text-text hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7V6a4 4 0 0 1 8 0v1M4.5 7h11l-1 13h-9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aki-green-500 px-1 text-[11px] font-bold text-text-on-green">
                {totalItems}
              </span>
            )}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            onClick={() => analytics.track({ eventType: 'whatsapp_click' })}
            className={clsx(buttonStyles('whatsapp', 'sm'), 'hidden sm:inline-flex')}
          >
            Falar no WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden rounded-xl p-2.5 text-text hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Navegação mobile" className="lg:hidden border-t border-border bg-bg px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'block rounded-lg px-3 py-2.5 text-sm font-medium',
                    pathname === link.href ? 'bg-surface-2 text-aki-green-400' : 'text-text hover:bg-surface-2',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <form onSubmit={submitSearch} className="mt-3 flex md:hidden">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/70 focus-visible:outline-none focus-visible:border-aki-green-500"
            />
          </form>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className={clsx(buttonStyles('whatsapp', 'md'), 'mt-3 w-full sm:hidden')}
          >
            Falar no WhatsApp
          </a>
        </nav>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} whatsappNumber={whatsappNumber} />
    </header>
  );
}
