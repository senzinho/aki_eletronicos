import type { Metadata } from 'next';
import { ContactForm } from '../../../components/site/ContactForm';
import { Card } from '../../../components/ui/Card';
import { Reveal } from '../../../components/ui/Reveal';
import { settings } from '../../../lib/api';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Aki Eletrônicos: endereço, telefone, e-mail e formulário de contato.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato',
    description: 'Fale com a Aki Eletrônicos: endereço, telefone, e-mail e formulário de contato.',
  },
};

export default async function ContatoPage() {
  const s = await settings.get();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold mb-2">Fale com a gente</h1>
        <p className="text-text-muted mb-10 max-w-lg">
          Envie sua mensagem pelo formulário ou fale diretamente pelo WhatsApp para um atendimento mais rápido.
        </p>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <Reveal className="reveal-left">
          <Card className="p-6 sm:p-8">
            <ContactForm type="contato" />
          </Card>
        </Reveal>

        <div className="flex flex-col gap-4">
          {[
            ['Endereço', s.endereco],
            ['Telefone / WhatsApp', s.telefone],
            ['E-mail', s.email],
            ['Horário', s.horario_atendimento],
          ].map(([label, value], i) => (
            <Reveal key={label} delay={i * 80} className="reveal-right">
              <Card className="p-5 transition-all duration-300 hover:border-aki-green-500/40 hover:-translate-y-0.5">
                <h2 className="font-heading text-sm font-semibold mb-1">{label}</h2>
                <p className="text-sm text-text-muted">{value}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
