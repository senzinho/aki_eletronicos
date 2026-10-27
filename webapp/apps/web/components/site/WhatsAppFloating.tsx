import { settings } from '../../lib/api';
import { WhatsAppFloatingClient } from './WhatsAppFloatingClient';

export async function WhatsAppFloating() {
  const siteSettings = await settings.get();
  return <WhatsAppFloatingClient whatsappNumber={siteSettings.whatsapp || '5541998132536'} />;
}
