'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Logo } from './Logo';
import { buttonStyles } from '../ui/button-styles';
import { useCartStore } from '../../lib/cart-store';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';
import { CartDrawer } from './CartDrawer';
import { WhatsAppIcon } from './WhatsAppIcon';

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
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());
  const cartOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);

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
        'sticky top-0 z-40 border-b bg-bg transition-colors duration-300',
        scrolled ? 'border-border' : 'border-transparent',
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
                'relative text-sm font-medium transition-colors hover:text-aki-green-400 py-1',
                'after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-aki-green-400 after:transition-all after:duration-300',
                pathname === link.href ? 'text-aki-green-400 after:w-full' : 'text-text-muted after:w-0 hover:after:w-full',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="relative hidden md:flex flex-1 max-w-xs ml-auto items-center">
          <label htmlFor="header-search" className="sr-only">
            Pesquisar produtos
          </label>
          <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3 text-text-muted" />
          <input
            id="header-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-xl border border-border bg-surface-1 py-2 pl-9 pr-3.5 text-sm text-text placeholder:text-text-muted/70 transition-colors focus-visible:outline-none focus-visible:border-aki-green-500 focus-visible:ring-2 focus-visible:ring-aki-green-500/30"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            type="button"
            onClick={() => openCart()}
            aria-label={`Abrir seleção de produtos (${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`}
            className="relative rounded-xl p-2.5 text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="animate-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aki-green-500 px-1 text-[11px] font-bold text-text-on-green"
              >
                {totalItems}
              </span>
            )}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            onClick={() => analytics.track({ eventType: 'whatsapp_click' })}
            className={clsx(buttonStyles('whatsapp', 'sm', 'gap-1.5'), 'hidden sm:inline-flex')}
          >
            <WhatsAppIcon size={15} />
            Falar no WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden rounded-xl p-2.5 text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
          >
            <span className="relative block h-[21px] w-[21px]">
              <Menu size={21} strokeWidth={1.8} className={clsx('absolute inset-0 transition-all duration-200', menuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100')} />
              <X size={21} strokeWidth={1.8} className={clsx('absolute inset-0 transition-all duration-200', menuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0')} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Navegação mobile"
        className={clsx(
          'lg:hidden grid overflow-hidden border-t border-border bg-bg transition-[grid-template-rows] duration-300 ease-out',
          menuOpen ? 'grid-rows-[1fr] border-opacity-100' : 'grid-rows-[0fr] border-opacity-0',
        )}
      >
        <div className="min-h-0 px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-surface-2 text-aki-green-400' : 'text-text hover:bg-surface-2',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <form onSubmit={submitSearch} className="relative mt-3 flex md:hidden">
            <Search size={16} strokeWidth={2} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full rounded-xl border border-border bg-surface-1 py-2.5 pl-9 pr-3.5 text-sm text-text placeholder:text-text-muted/70 focus-visible:outline-none focus-visible:border-aki-green-500"
            />
          </form>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className={clsx(buttonStyles('whatsapp', 'md', 'gap-1.5'), 'mt-3 w-full sm:hidden')}
          >
            <WhatsAppIcon size={16} />
            Falar no WhatsApp
          </a>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={closeCart} whatsappNumber={whatsappNumber} />
    </header>
  );
}
