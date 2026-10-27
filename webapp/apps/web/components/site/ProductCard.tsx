'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, ImageOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { buttonStyles } from '../ui/button-styles';
import { formatPrice, installmentValue } from '../../lib/format';
import { assetUrl } from '../../lib/asset-url';
import { buildSingleProductMessage, buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { Product } from '../../lib/types';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  siteUrl: string;
}

export function ProductCard({ product, whatsappNumber, siteUrl }: ProductCardProps) {
  const img = assetUrl(product.mainImage) ?? assetUrl(product.images[0]?.image ?? null);
  const hasDiscount = Boolean(product.priceFrom);
  const mainPrice = product.pricePix ?? product.priceTo;
  const showCardPixNote = product.pricePix && product.pricePix !== product.priceTo;

  const productUrl = `${siteUrl}/produto/${product.slug}`;

  const whatsappHref = buildWhatsAppLink(
    whatsappNumber,
    buildSingleProductMessage({
      name: product.name,
      brandName: product.brand?.name,
      quantity: 1,
      unitPrice: Number(mainPrice),
      condition: 'pix',
      productUrl,
    }),
  );

  return (
    <Card className="group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-aki-green-500/60 hover:shadow-[0_8px_30px_rgba(47,211,92,0.12)]">
      <Link href={`/produto/${product.slug}`} className="relative block aspect-square bg-surface-1">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 280px, 45vw"
            className="object-contain p-6 transition-transform duration-250 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-text-muted">
            <ImageOff size={22} strokeWidth={1.5} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && <Badge tone="warning">Oferta</Badge>}
          {product.badge && !hasDiscount && <Badge tone="green">{product.badge}</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{product.brand.name}</span>
        )}
        <Link href={`/produto/${product.slug}`} className="font-heading text-sm font-semibold leading-snug text-text hover:text-aki-green-400">
          {product.name}
        </Link>

        <div className="mt-1 flex flex-col gap-0.5">
          {hasDiscount && (
            <span className="text-xs text-text-muted line-through">{formatPrice(product.priceFrom)}</span>
          )}
          <span className="font-heading text-lg font-bold text-aki-green-400">{formatPrice(mainPrice)}</span>
          {showCardPixNote && (
            <span className="text-xs text-text-muted">à vista no Pix</span>
          )}
          {product.installmentMax && product.installmentMax > 1 && (
            <span className="text-xs text-text-muted">
              ou {product.installmentMax}x de {installmentValue(product.priceTo, product.installmentMax)}
              {product.installmentInterestFree ? ' sem juros' : ' com juros'}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Link href={`/produto/${product.slug}`} className={buttonStyles('secondary', 'sm', 'gap-1.5 whitespace-nowrap')}>
            <Eye size={14} strokeWidth={2} />
            Ver detalhes
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            onClick={() => analytics.track({ eventType: 'whatsapp_click', productId: product.id })}
            className={buttonStyles('whatsapp', 'sm', 'gap-1.5 whitespace-nowrap')}
          >
            <WhatsAppIcon size={14} />
            Comprar
          </a>
        </div>
      </div>
    </Card>
  );
}
