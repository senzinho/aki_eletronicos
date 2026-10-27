'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Drawer } from '../ui/Drawer';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buttonStyles } from '../ui/button-styles';
import { cartItemLineTotal, cartItemUnitPrice, useCartStore } from '../../lib/cart-store';
import { formatPrice } from '../../lib/format';
import { assetUrl } from '../../lib/asset-url';
import { buildCartMessage, buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export function CartDrawer({ open, onClose, whatsappNumber }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const updateCondition = useCartStore((s) => s.updateCondition);
  const clear = useCartStore((s) => s.clear);

  const total = items.reduce((sum, i) => sum + cartItemLineTotal(i), 0);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  function checkout() {
    const message = buildCartMessage(
      items.map((i) => ({
        name: i.name,
        brandName: i.brandName,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        unitPrice: cartItemUnitPrice(i),
        condition: i.condition,
        installments: i.installments,
        installmentInterestFree: i.installmentInterestFree,
        productUrl: `${siteUrl}/produto/${i.slug}`,
      })),
    );
    analytics.track({ eventType: 'whatsapp_click' });
    window.open(buildWhatsAppLink(whatsappNumber, message), '_blank', 'noopener');
    clear();
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Sua seleção (${items.length})`}
      titleContent={
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aki-green-500/15 text-aki-green-400">
            <ShoppingBag size={17} strokeWidth={2} />
          </span>
          <h2 className="font-heading text-lg font-semibold">
            Sua seleção
            {items.length > 0 && <span className="ml-1.5 text-sm font-normal text-text-muted">({items.length})</span>}
          </h2>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <span className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-1 text-text-muted">
            <ShoppingBag size={28} strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-text">Sua seleção está vazia</p>
            <p className="mt-1 text-xs text-text-muted">Escolha produtos no catálogo para consultar pelo WhatsApp.</p>
          </div>
          <Link href="/produtos" onClick={onClose} className={buttonStyles('secondary', 'sm')}>
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
            {items.map((item, index) => {
              const img = assetUrl(item.mainImage);
              return (
                <li
                  key={item.key}
                  className="animate-item-in rounded-2xl border border-border bg-surface-1 p-3"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-2">
                      {img ? (
                        <Image src={img} alt={item.name} fill className="object-contain p-1.5" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-text-muted">
                          <ShoppingBag size={18} strokeWidth={1.5} />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produto/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium leading-snug line-clamp-2 hover:text-aki-green-400"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remover ${item.name}`}
                          className="shrink-0 rounded-lg p-1 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 size={15} strokeWidth={2} />
                        </button>
                      </div>
                      {item.variantLabel && (
                        <span className="w-fit rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-text-muted">
                          {item.variantLabel}
                        </span>
                      )}
                      <span className="font-heading text-sm font-semibold text-aki-green-400">
                        {formatPrice(cartItemLineTotal(item))}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-lg border border-border bg-surface-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Diminuir quantidade"
                        className="p-1.5 text-text-muted transition-colors hover:text-text disabled:opacity-30 disabled:hover:text-text-muted"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>
                      <span className="min-w-6 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                        className="p-1.5 text-text-muted transition-colors hover:text-text"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    </div>

                    {item.installments && item.installments > 1 ? (
                      <div className="flex rounded-lg border border-border bg-surface-2 p-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => updateCondition(item.key, 'pix')}
                          aria-pressed={item.condition === 'pix'}
                          className={clsx(
                            'rounded-md px-2 py-1 font-medium transition-colors',
                            item.condition === 'pix' ? 'bg-aki-green-500/15 text-aki-green-400' : 'text-text-muted hover:text-text',
                          )}
                        >
                          Pix
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCondition(item.key, 'parcelado')}
                          aria-pressed={item.condition === 'parcelado'}
                          className={clsx(
                            'rounded-md px-2 py-1 font-medium transition-colors',
                            item.condition === 'parcelado' ? 'bg-aki-green-500/15 text-aki-green-400' : 'text-text-muted hover:text-text',
                          )}
                        >
                          {item.installments}x
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-text-muted">à vista no Pix</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center justify-between font-heading text-base font-semibold">
              <span>Total</span>
              <span className="text-aki-green-400">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-text-muted">
              Esta seleção não é uma cobrança. Você vai confirmar a compra e as condições diretamente com a loja pelo WhatsApp.
            </p>
            <button type="button" onClick={checkout} className={buttonStyles('whatsapp', 'lg', 'w-full gap-2')}>
              <WhatsAppIcon size={18} />
              Finalizar no WhatsApp
            </button>
            <button
              type="button"
              onClick={clear}
              className={buttonStyles('ghost', 'sm', 'w-full gap-1.5')}
            >
              <Trash2 size={14} strokeWidth={2} />
              Esvaziar seleção
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
