export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return '';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function installmentValue(total: string | number, installments: number): string {
  const n = typeof total === 'string' ? Number(total) : total;
  if (Number.isNaN(n) || installments <= 0) return '';
  return formatPrice(n / installments);
}
