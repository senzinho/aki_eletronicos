import Link from 'next/link';
import type { ReactNode } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { categories, settings, socialLinks } from '../../lib/api';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BrandMark } from './BrandMark';

const SOCIAL_ICON: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.77 4.9 4.9 0 01-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.77-1.15 4.9 4.9 0 01-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 015.45.53C6.09.28 6.82.11 7.88.06 8.94.01 9.28 0 12 0zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  ),
};

export async function SiteFooter() {
  const [siteSettings, categoryList, links] = await Promise.all([
    settings.get().catch(() => ({}) as Record<string, string>),
    categories.list().catch(() => []),
    socialLinks.list().catch(() => []),
  ]);

  const companyName = siteSettings.nome_empresa || 'Aki Eletrônicos';
  const whatsappHref = buildWhatsAppLink(
    siteSettings.whatsapp || '5541998132536',
    'Olá! Vim pelo site e gostaria de saber mais informações.',
  );

  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark logoPath={siteSettings.logo || null} companyName={companyName} size={34} />
            <span className="font-heading text-lg font-bold">{companyName}</span>
          </div>
          <p className="text-sm text-text-muted">
            Smartphones, acessórios e assistência técnica especializada, com atendimento direto pelo WhatsApp.
          </p>
          {links.length > 0 && (
            <div className="flex gap-2 mt-1">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={link.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-aki-green-500 hover:text-aki-green-400"
                >
                  {SOCIAL_ICON[link.platform] ?? link.platform[0]?.toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-sm font-semibold text-text">Categorias</h3>
          {categoryList.map((c) => (
            <Link key={c.id} href={`/categoria/${c.slug}`} className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
              {c.name}
            </Link>
          ))}
          <Link href="/ofertas" className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
            Ofertas
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-sm font-semibold text-text">Institucional</h3>
          <Link href="/sobre" className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
            Sobre a loja
          </Link>
          <Link href="/reparos" className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
            Assistência técnica
          </Link>
          <Link href="/montagem-de-pc" className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
            Montagem de PC
          </Link>
          <Link href="/contato" className="w-fit text-sm text-text-muted transition-colors hover:text-aki-green-400">
            Contato
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-aki-green-400"
          >
            <WhatsAppIcon size={14} />
            Falar no WhatsApp
          </a>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="font-heading text-sm font-semibold text-text">Contato</h3>
          {siteSettings.endereco && (
            <p className="flex items-start gap-2 text-sm text-text-muted">
              <MapPin size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />
              {siteSettings.endereco}
            </p>
          )}
          {siteSettings.telefone && (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <Phone size={15} strokeWidth={1.8} className="shrink-0" />
              {siteSettings.telefone}
            </p>
          )}
          {siteSettings.email && (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <Mail size={15} strokeWidth={1.8} className="shrink-0" />
              {siteSettings.email}
            </p>
          )}
          {siteSettings.horario_atendimento && (
            <p className="flex items-start gap-2 text-sm text-text-muted">
              <Clock size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />
              {siteSettings.horario_atendimento}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-text-muted sm:px-6">
        © {new Date().getFullYear()} {companyName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
