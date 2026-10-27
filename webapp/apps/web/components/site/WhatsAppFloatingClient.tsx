'use client';

import { buildWhatsAppLink } from '../../lib/whatsapp';
import { analytics } from '../../lib/api';

export function WhatsAppFloatingClient({ whatsappNumber }: { whatsappNumber: string }) {
  const href = buildWhatsAppLink(whatsappNumber, 'Olá! Gostaria de falar com a equipe da Aki Eletrônicos.');

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 animate-item-in" style={{ animationDelay: '600ms' }}>
      <span className="absolute inset-0 rounded-full bg-aki-green-500/50 motion-safe:animate-ping [animation-duration:2.5s]" />
      <a
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => analytics.track({ eventType: 'whatsapp_click' })}
        aria-label="Falar no WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-aki-green-500 text-text-on-green shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110 hover:aki-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10.1 9 9.7 8 9.5 7.5c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.9 3.3 1.4 5.2 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3.4 1.1 1.1-3.3-.2-.3C3.5 14.6 3 13.3 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z" />
        </svg>
      </a>
    </div>
  );
}
