import type { ReactNode } from 'react';
import { PromoBar } from '../../components/site/PromoBar';
import { SiteHeader } from '../../components/site/SiteHeader';
import { SiteFooter } from '../../components/site/SiteFooter';
import { WhatsAppFloating } from '../../components/site/WhatsAppFloating';
import { CustomBodyScripts, GtmNoscript, ThirdPartyScripts } from '../../components/site/ThirdPartyScripts';
import { settings } from '../../lib/api';
import { assetUrl } from '../../lib/asset-url';

// Settings/products come from the admin-managed API, so pages here should
// always reflect live data (and this avoids needing a reachable API at build time).
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await settings.get();
  const base = s.app_url || 'http://localhost:3002';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: s.nome_empresa || 'Aki Eletrônicos',
    image: assetUrl(s.og_image || s.logo || null) ?? undefined,
    telephone: s.telefone || undefined,
    email: s.email || undefined,
    address: s.endereco
      ? { '@type': 'PostalAddress', streetAddress: s.endereco, addressRegion: 'PR', addressCountry: 'BR' }
      : undefined,
    url: base,
    sameAs: [s.facebook, s.instagram].filter(Boolean),
  };

  return (
    <>
      <ThirdPartyScripts gtmId={s.gtm_id || undefined} ga4Id={s.ga4_id || undefined} customHead={s.custom_scripts_head || undefined} />
      <GtmNoscript gtmId={s.gtm_id || undefined} />
      <PromoBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloating />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <CustomBodyScripts html={s.custom_scripts_body || undefined} />
    </>
  );
}
