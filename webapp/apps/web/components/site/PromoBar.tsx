import { promotionalBars } from '../../lib/api';
import { PromoBarClient } from './PromoBarClient';

export async function PromoBar() {
  const items = await promotionalBars.list();
  return <PromoBarClient items={items} />;
}
