import { formatPrice, installmentValue } from './format';

export interface WhatsAppMessageItem {
  name: string;
  brandName?: string | null;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number;
  condition: 'pix' | 'parcelado';
  installments?: number | null;
  installmentInterestFree?: boolean;
  productUrl: string;
}

export function buildWhatsAppLink(phoneDigitsOnly: string, message: string): string {
  const number = phoneDigitsOnly.replace(/\D/g, '');
  return `https://api.whatsapp.com/send/?phone=${number}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

function formatCondition(item: WhatsAppMessageItem): string {
  if (item.condition === 'pix') return 'À vista no Pix';
  if (item.installments && item.installments > 1) {
    const parcela = installmentValue(item.unitPrice, item.installments);
    const juros = item.installmentInterestFree === false ? 'com juros' : 'sem juros';
    return `Parcelado em ${item.installments}x de ${parcela} (${juros})`;
  }
  return 'A combinar';
}

export function buildSingleProductMessage(item: WhatsAppMessageItem): string {
  const total = item.unitPrice * item.quantity;
  const lines = [
    'Olá! Vim pelo site da Aki Eletrônicos e gostaria de consultar a disponibilidade deste produto.',
    '',
    `Produto: *${item.name}*`,
  ];
  if (item.brandName) lines.push(`Marca: ${item.brandName}`);
  if (item.variantLabel) lines.push(`Variante: ${item.variantLabel}`);
  lines.push(
    `Quantidade: ${item.quantity}`,
    `Preço unitário: ${formatPrice(item.unitPrice)}`,
    `*Total: ${formatPrice(total)}*`,
    `Pagamento escolhido: ${formatCondition(item)}`,
    '',
    `Link do produto: ${item.productUrl}`,
    '',
    'Poderiam confirmar a disponibilidade e as condições para finalizar a compra?',
  );
  return lines.join('\n');
}

export function buildCartMessage(items: WhatsAppMessageItem[]): string {
  const lines = [
    'Olá! Vim pelo site da Aki Eletrônicos e gostaria de consultar a disponibilidade destes produtos.',
    '',
  ];

  let grandTotal = 0;
  items.forEach((item, index) => {
    const total = item.unitPrice * item.quantity;
    grandTotal += total;
    lines.push(`*${index + 1}) ${item.name}${item.variantLabel ? ` — ${item.variantLabel}` : ''}*`);
    lines.push(`   Quantidade: ${item.quantity}`);
    lines.push(`   Preço unitário: ${formatPrice(item.unitPrice)}`);
    lines.push(`   Total: ${formatPrice(total)}`);
    lines.push(`   Pagamento: ${formatCondition(item)}`);
    lines.push(`   Link: ${item.productUrl}`);
    lines.push('');
  });

  lines.push(`*Total geral: ${formatPrice(grandTotal)}*`);
  lines.push('');
  lines.push('Poderiam confirmar a disponibilidade e as condições para finalizar a compra?');

  return lines.join('\n');
}
