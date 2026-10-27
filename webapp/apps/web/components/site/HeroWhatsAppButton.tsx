'use client';

import { buttonStyles, type ButtonVariant } from '../ui/button-styles';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroWhatsAppButtonProps {
  whatsappNumber: string;
  variant?: ButtonVariant;
  label?: string;
}

export function HeroWhatsAppButton({ whatsappNumber, variant = 'whatsapp', label = 'Falar com um vendedor' }: HeroWhatsAppButtonProps) {
  const href = buildWhatsAppLink(whatsappNumber, 'Olá! Vim pelo site e gostaria de falar com um vendedor.');
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => analytics.track({ eventType: 'whatsapp_click' })}
      className={buttonStyles(variant, 'lg', 'gap-2')}
    >
      <WhatsAppIcon size={18} />
      {label}
    </a>
  );
}
