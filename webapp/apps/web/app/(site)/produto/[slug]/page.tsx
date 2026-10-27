import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '../../../../components/site/ProductDetailClient';
import { ProductCard } from '../../../../components/site/ProductCard';
import { ApiError, products, settings } from '../../../../lib/api';
import { assetUrl } from '../../../../lib/asset-url';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await products.bySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return {};
  const { product } = data;
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.subtitle || undefined;
  const image = assetUrl(product.mainImage);
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, s] = await Promise.all([getProduct(slug), settings.get()]);
  if (!data) notFound();

  const { product, related } = data;
  const siteUrl = s.app_url || 'http://localhost:3002';
  const whatsappNumber = s.whatsapp || '5541998132536';
  const productUrl = `${siteUrl}/produto/${product.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? product.subtitle ?? undefined,
    image: assetUrl(product.mainImage) ?? undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    sku: String(product.id),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BRL',
      price: product.pricePix ?? product.priceTo,
      availability: 'https://schema.org/InStock',
    },
    ...(product.ratingCount > 0 && product.ratingAvg
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingAvg,
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-text">
          Início
        </Link>
        {' / '}
        <Link href="/produtos" className="hover:text-text">
          Produtos
        </Link>
        {product.category && (
          <>
            {' / '}
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-text">
              {product.category.name}
            </Link>
          </>
        )}
        {' / '}
        <span className="text-text">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />

      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-bold mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} siteUrl={siteUrl} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}
