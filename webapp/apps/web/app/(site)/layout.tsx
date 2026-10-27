import type { ReactNode } from 'react';
import { PromoBar } from '../../components/site/PromoBar';
import { SiteHeader } from '../../components/site/SiteHeader';
import { SiteFooter } from '../../components/site/SiteFooter';
import { WhatsAppFloating } from '../../components/site/WhatsAppFloating';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PromoBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloating />
    </>
  );
}
