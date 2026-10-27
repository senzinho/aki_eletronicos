'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Check, Minus, Plus, Star, ZoomIn } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buttonStyles } from '../ui/button-styles';
import { Badge } from '../ui/Badge';
import { formatPrice, installmentValue } from '../../lib/format';
import { assetUrl } from '../../lib/asset-url';
import { buildSingleProductMessage, buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/types';

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
  siteUrl: string;
}

export function ProductDetailClient({ product, whatsappNumber, siteUrl }: ProductDetailClientProps) {
  const images = useMemo(() => {
    const list = [product.mainImage, ...product.images.map((i) => i.image)].filter(
      (v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i,
    );
    return list.length > 0 ? list : [null];
  }, [product.mainImage, product.images]);

  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const variants = product.variants ?? [];
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter((v): v is string => Boolean(v)))],
    [variants],
  );
  const storages = useMemo(
    () => [...new Set(variants.map((v) => v.storage).filter((v): v is string => Boolean(v)))],
    [variants],
  );

  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(storages[0]);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<'pix' | 'parcelado'>('pix');
  const [justAdded, setJustAdded] = useState(false);

  const matchedVariant =
    variants.length > 0
      ? variants.find(
          (v) =>
            (colors.length === 0 || v.color === selectedColor) &&
            (storages.length === 0 || v.storage === selectedStorage),
        )
      : undefined;

  const unavailable = variants.length > 0 && matchedVariant ? !matchedVariant.isAvailable : false;

  const basePriceFull = matchedVariant?.priceOverride ? Number(matchedVariant.priceOverride) : Number(product.priceTo);
  const basePricePix = matchedVariant?.priceOverride
    ? Number(matchedVariant.priceOverride)
    : Number(product.pricePix ?? product.priceTo);
  const unitPrice = condition === 'pix' ? basePricePix : basePriceFull;
  const hasInstallments = Boolean(product.installmentMax && product.installmentMax > 1);

  const variantLabel = [selectedColor, selectedStorage].filter(Boolean).join(' · ') || null;
  const productUrl = `${siteUrl}/produto/${product.slug}`;
  const addCartItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function buyNow() {
    analytics.track({ eventType: 'whatsapp_click', productId: product.id });
    const message = buildSingleProductMessage({
      name: product.name,
      brandName: product.brand?.name,
      variantLabel,
      quantity,
      unitPrice,
      condition,
      installments: condition === 'parcelado' ? product.installmentMax : undefined,
      installmentInterestFree: product.installmentInterestFree,
      productUrl,
    });
    window.open(buildWhatsAppLink(whatsappNumber, message), '_blank', 'noopener');
  }

  function addToSelection() {
    addCartItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brandName: product.brand?.name,
      mainImage: product.mainImage,
      variantId: matchedVariant?.id ?? null,
      variantLabel,
      quantity,
      unitPricePix: basePricePix,
      unitPriceFull: basePriceFull,
      condition,
      installments: condition === 'parcelado' ? product.installmentMax : undefined,
      installmentInterestFree: product.installmentInterestFree,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    openCart();
  }

  const currentImg = assetUrl(images[activeImage]);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* GALERIA */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => currentImg && setZoomOpen(true)}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-1 cursor-zoom-in"
          aria-label="Ampliar imagem do produto"
        >
          {currentImg ? (
            <Image
              key={currentImg}
              src={currentImg}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="animate-item-in object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted text-sm">Sem imagem</div>
          )}
          {currentImg && (
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 text-text opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              <ZoomIn size={16} strokeWidth={2} />
            </span>
          )}
        </button>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => {
              const thumb = assetUrl(img);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === activeImage}
                  className={clsx(
                    'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-surface-1 transition-all duration-200',
                    i === activeImage ? 'border-aki-green-500 ring-2 ring-aki-green-500/30' : 'border-border hover:border-aki-green-500/50',
                  )}
                >
                  {thumb && <Image src={thumb} alt="" fill className="object-contain p-1.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-4">
        {product.brand && <span className="text-sm font-medium uppercase tracking-wide text-text-muted">{product.brand.name}</span>}
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">{product.name}</h1>
        {product.subtitle && <p className="text-text-muted">{product.subtitle}</p>}

        <div className="flex items-center gap-2 flex-wrap">
          {product.badge && <Badge tone="green">{product.badge}</Badge>}
          {product.priceFrom && <Badge tone="warning">Oferta</Badge>}
          {product.ratingCount > 0 && product.ratingAvg && (
            <span className="inline-flex items-center gap-1 text-sm text-text-muted">
              <Star size={14} strokeWidth={0} fill="currentColor" className="text-warning" />
              {product.ratingAvg} ({product.ratingCount})
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface-2 p-4">
          {product.priceFrom && <span className="text-sm text-text-muted line-through">{formatPrice(product.priceFrom)}</span>}
          <span className="font-heading text-3xl font-bold text-aki-green-400">{formatPrice(unitPrice)}</span>
          <span className="text-xs text-text-muted">
            {condition === 'pix' ? 'à vista no Pix' : 'no cartão / outras condições'}
          </span>
          {hasInstallments && (
            <span className="text-xs text-text-muted">
              ou {product.installmentMax}x de {installmentValue(basePriceFull, product.installmentMax!)}
              {product.installmentInterestFree ? ' sem juros' : ' com juros'}
            </span>
          )}
          {product.installmentNote && <span className="text-xs text-text-muted">{product.installmentNote}</span>}
        </div>

        {colors.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Cor</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  aria-pressed={c === selectedColor}
                  className={clsx(
                    'rounded-xl border px-3.5 py-2 text-sm transition-all duration-200',
                    c === selectedColor
                      ? 'border-aki-green-500 bg-aki-green-500/10 text-text shadow-[0_0_0_1px_var(--aki-green-500)]'
                      : 'border-border text-text-muted hover:border-aki-green-500/50 hover:text-text',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {storages.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Armazenamento</span>
            <div className="flex flex-wrap gap-2">
              {storages.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStorage(st)}
                  aria-pressed={st === selectedStorage}
                  className={clsx(
                    'rounded-xl border px-3.5 py-2 text-sm transition-all duration-200',
                    st === selectedStorage
                      ? 'border-aki-green-500 bg-aki-green-500/10 text-text shadow-[0_0_0_1px_var(--aki-green-500)]'
                      : 'border-border text-text-muted hover:border-aki-green-500/50 hover:text-text',
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {unavailable && (
          <p className="text-sm text-danger" role="status">
            Esta variante está indisponível no momento. Consulte outras opções pelo WhatsApp.
          </p>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">Condição de pagamento</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCondition('pix')}
              aria-pressed={condition === 'pix'}
              className={clsx(
                'flex-1 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200',
                condition === 'pix'
                  ? 'border-aki-green-500 bg-aki-green-500/10 text-text shadow-[0_0_0_1px_var(--aki-green-500)]'
                  : 'border-border text-text-muted hover:border-aki-green-500/50 hover:text-text',
              )}
            >
              Pix à vista
            </button>
            {hasInstallments && (
              <button
                type="button"
                onClick={() => setCondition('parcelado')}
                aria-pressed={condition === 'parcelado'}
                className={clsx(
                  'flex-1 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200',
                  condition === 'parcelado'
                    ? 'border-aki-green-500 bg-aki-green-500/10 text-text shadow-[0_0_0_1px_var(--aki-green-500)]'
                    : 'border-border text-text-muted hover:border-aki-green-500/50 hover:text-text',
                )}
              >
                Parcelado
              </button>
            )}
          </div>
          <p className="text-xs text-text-muted">
            Esta seleção não é uma cobrança nem uma confirmação de pagamento — serve para preparar sua consulta pelo WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text">Quantidade</span>
          <div className="flex items-center rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 text-text-muted transition-colors hover:text-text disabled:opacity-30"
              aria-label="Diminuir quantidade"
            >
              <Minus size={15} strokeWidth={2.5} />
            </button>
            <span className="min-w-8 text-center text-sm">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => q + 1)} className="p-2.5 text-text-muted transition-colors hover:text-text" aria-label="Aumentar quantidade">
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row mt-2">
          <button type="button" onClick={buyNow} disabled={unavailable} className={buttonStyles('whatsapp', 'lg', 'flex-1 gap-2')}>
            <WhatsAppIcon size={18} />
            Comprar pelo WhatsApp
          </button>
          <button type="button" onClick={addToSelection} disabled={unavailable} className={buttonStyles('secondary', 'lg', 'flex-1 gap-1.5')}>
            {justAdded && <Check size={16} strokeWidth={2.5} className="animate-pop" />}
            {justAdded ? 'Adicionado' : 'Adicionar à seleção'}
          </button>
        </div>

        {product.description && (
          <div className="mt-4 border-t border-border pt-4">
            <h2 className="font-heading text-base font-semibold mb-2">Descrição</h2>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}
      </div>

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title={product.name} className="w-[min(800px,94vw)]">
        {currentImg && (
          <div className="relative aspect-square w-full">
            <Image src={currentImg} alt={product.name} fill className="object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
}
