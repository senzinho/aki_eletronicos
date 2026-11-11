import { settings } from '../../lib/api';
import { HeaderClient } from './HeaderClient';

export async function SiteHeader() {
  const siteSettings = await settings.get().catch(() => ({}) as Record<string, string>);
  return (
    <HeaderClient
      companyName={siteSettings.nome_empresa || 'Aki Eletrônicos'}
      logoPath={siteSettings.logo || null}
      whatsappNumber={siteSettings.whatsapp || '5541998132536'}
    />
  );
}
