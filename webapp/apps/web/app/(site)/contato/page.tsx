import type { Metadata } from 'next';
import { ContactForm } from '../../../components/site/ContactForm';
import { Card } from '../../../components/ui/Card';
import { settings } from '../../../lib/api';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Aki Eletrônicos: endereço, telefone, e-mail e formulário de contato.',
};

export default async function ContatoPage() {
  const s = await settings.get();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold mb-2">Fale com a gente</h1>
      <p className="text-text-muted mb-10 max-w-lg">
        Envie sua mensagem pelo formulário ou fale diretamente pelo WhatsApp para um atendimento mais rápido.
      </p>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <ContactForm type="contato" />
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="font-heading text-sm font-semibold mb-1">Endereço</h2>
            <p className="text-sm text-text-muted">{s.endereco}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-heading text-sm font-semibold mb-1">Telefone / WhatsApp</h2>
            <p className="text-sm text-text-muted">{s.telefone}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-heading text-sm font-semibold mb-1">E-mail</h2>
            <p className="text-sm text-text-muted">{s.email}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-heading text-sm font-semibold mb-1">Horário</h2>
            <p className="text-sm text-text-muted">{s.horario_atendimento}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
