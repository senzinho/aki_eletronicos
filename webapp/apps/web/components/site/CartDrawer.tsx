'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Drawer } from '../ui/Drawer';
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
    <Drawer open={open} onClose={onClose} title={`Sua seleção (${items.length})`}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <p className="text-text-muted text-sm">Sua seleção está vazia.</p>
          <Link href="/produtos" onClick={onClose} className={buttonStyles('secondary', 'sm')}>
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex flex-1 flex-col gap-4 overflow-y-auto">
            {items.map((item) => {
              const img = assetUrl(item.mainImage);
              return (
                <li key={item.key} className="flex gap-3 border-b border-border pb-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-1">
                    {img && <Image src={img} alt={item.name} fill className="object-contain p-1.5" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/produto/${item.slug}`} onClick={onClose} className="text-sm font-medium leading-snug hover:text-aki-green-400">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remover ${item.name}`}
                        className="shrink-0 text-text-muted hover:text-danger"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {item.variantLabel && <span className="text-xs text-text-muted">{item.variantLabel}</span>}

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Diminuir quantidade"
                          className="px-2 py-1 text-text-muted hover:text-text disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                          className="px-2 py-1 text-text-muted hover:text-text"
                        >
                          +
                        </button>
                      </div>

                      <select
                        value={item.condition}
                        onChange={(e) => updateCondition(item.key, e.target.value as 'pix' | 'parcelado')}
                        aria-label={`Condição de pagamento para ${item.name}`}
                        className="rounded-lg border border-border bg-surface-1 px-2 py-1 text-xs text-text"
                      >
                        <option value="pix">Pix</option>
                        {item.installments && item.installments > 1 && (
                          <option value="parcelado">{item.installments}x</option>
                        )}
                      </select>
                    </div>

                    <span className="text-sm font-semibold text-aki-green-400">
                      {formatPrice(cartItemLineTotal(item))}
                    </span>
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
            <button type="button" onClick={checkout} className={buttonStyles('whatsapp', 'lg', 'w-full')}>
              Finalizar no WhatsApp
            </button>
            <button type="button" onClick={clear} className={buttonStyles('ghost', 'sm', 'w-full')}>
              Esvaziar seleção
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
