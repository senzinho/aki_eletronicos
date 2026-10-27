import type { Metadata } from 'next';
import { HeroWhatsAppButton } from '../../../components/site/HeroWhatsAppButton';
import { ContactForm } from '../../../components/site/ContactForm';
import { Card } from '../../../components/ui/Card';
import { settings } from '../../../lib/api';

export const metadata: Metadata = {
  title: 'Assistência Técnica',
  description:
    'Assistência técnica especializada: troca de tela, bateria, conector de carga, câmera, diagnóstico e reparos de smartphones em Colombo/PR.',
};

const SERVICES = [
  ['Troca de tela', 'Peças de qualidade e instalação precisa.'],
  ['Troca de bateria', 'Recupere a autonomia do seu aparelho.'],
  ['Conector de carga', 'Diagnóstico e reparo de carregamento.'],
  ['Câmera', 'Reparo de módulos de câmera frontal e traseira.'],
  ['Alto-falante', 'Áudio e viva-voz funcionando como novo.'],
  ['Microfone', 'Correção de falhas de captação de áudio.'],
  ['Software', 'Ajustes e otimização do sistema.'],
  ['Formatação', 'Formatação segura com backup dos seus dados.'],
  ['Diagnóstico', 'Identificação precisa da causa do problema.'],
  ['Outros reparos', 'Consulte-nos sobre qualquer outro problema.'],
] as const;

const PROCESS_STEPS = [
  ['01', 'Você chama', 'Fale com a gente pelo WhatsApp e descreva o problema.'],
  ['02', 'Diagnosticamos', 'Avaliamos seu aparelho com precisão técnica.'],
  ['03', 'Você aprova', 'Apresentamos o orçamento antes de qualquer reparo.'],
  ['04', 'Nós reparamos', 'Executamos o serviço com peças de qualidade.'],
] as const;

const DIFFERENTIALS = [
  ['Técnicos especializados', 'Equipe treinada para cada tipo de reparo.'],
  ['Diagnóstico profissional', 'Identificamos a causa real antes de agir.'],
  ['Peças de qualidade', 'Componentes selecionados para durabilidade.'],
  ['Garantia no serviço', 'Reparo com garantia e transparência total.'],
  ['Transparência', 'Você aprova o orçamento antes de começarmos.'],
  ['Atendimento rápido', 'Resposta ágil pelo WhatsApp.'],
] as const;

export default async function ReparosPage() {
  const s = await settings.get();

  return (
    <div>
      <section className="border-b border-border bg-surface-1/60">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-wide text-aki-green-400">Assistência técnica</span>
          <h1 className="mt-3 max-w-xl font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Seu celular parou. A gente resolve.
          </h1>
          <p className="mt-3 max-w-md text-text-muted">
            Diagnóstico preciso, reparos especializados e cuidado em cada detalhe.
          </p>
          <a href="#orcamento" className="mt-6 inline-flex">
            <HeroWhatsAppButton whatsappNumber={s.whatsapp || '5541998132536'} label="Solicitar orçamento" variant="primary" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-bold mb-8">Serviços</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map(([name, desc]) => (
            <Card key={name} className="flex flex-col gap-2 p-5">
              <h3 className="font-heading text-sm font-semibold">{name}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-1/40">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <h2 className="font-heading text-2xl font-bold mb-8">Como funciona?</h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {PROCESS_STEPS.map(([num, title, desc]) => (
              <div key={num} className="flex flex-col gap-2">
                <span className="font-heading text-2xl font-bold text-aki-green-400">{num}</span>
                <h3 className="font-heading text-sm font-semibold">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <h2 className="font-heading text-2xl font-bold mb-8">Por que confiar seu celular à nossa assistência?</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIALS.map(([title, desc]) => (
            <Card key={title} className="p-5">
              <h3 className="font-heading text-sm font-semibold mb-1.5">{title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="orcamento" className="border-t border-border bg-surface-1/40">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-4">
            <h2 className="font-heading text-2xl font-bold">Prefere falar direto?</h2>
            <p className="text-text-muted">Descreva o problema pelo WhatsApp e receba um retorno rápido da nossa equipe.</p>
            <HeroWhatsAppButton
              whatsappNumber={s.whatsapp || '5541998132536'}
              label="Falar direto no WhatsApp"
            />
          </div>
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold mb-5">Solicitar orçamento</h2>
            <ContactForm type="reparo" extraFields="reparo" />
          </Card>
        </div>
      </section>
    </div>
  );
}
