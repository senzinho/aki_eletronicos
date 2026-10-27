'use client';

import { useState, type FormEvent } from 'react';
import { Input, Textarea } from '../ui/Field';
import { buttonStyles } from '../ui/button-styles';
import { ApiError, serviceRequests } from '../../lib/api';
import type { ServiceRequestType } from '../../lib/types';

interface ContactFormProps {
  type: ServiceRequestType;
  extraFields?: 'reparo';
}

export function ContactForm({ type, extraFields }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = new FormData(e.currentTarget);
    try {
      await serviceRequests.create({
        type,
        name: String(form.get('name') ?? ''),
        phone: String(form.get('phone') ?? ''),
        email: String(form.get('email') ?? '') || undefined,
        deviceModel: String(form.get('deviceModel') ?? '') || undefined,
        problemType: String(form.get('problemType') ?? '') || undefined,
        message: String(form.get('message') ?? '') || undefined,
      });
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof ApiError ? err.message : 'Não foi possível enviar. Tente novamente.');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-aki-green-500/30 bg-aki-green-500/10 p-6 text-center">
        <p className="font-heading text-base font-semibold text-text mb-1">Recebemos sua solicitação!</p>
        <p className="text-sm text-text-muted">
          Nossa equipe vai entrar em contato pelo telefone ou e-mail informado. Para uma resposta mais rápida,
          fale diretamente pelo WhatsApp.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className={buttonStyles('ghost', 'sm', 'mt-4')}>
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input id="name" name="name" label="Nome" required maxLength={120} autoComplete="name" />
      <Input id="phone" name="phone" label="Telefone / WhatsApp" type="tel" required placeholder="(41) 90000-0000" autoComplete="tel" />
      <Input id="email" name="email" label="E-mail" type="email" autoComplete="email" />
      {extraFields === 'reparo' && (
        <>
          <Input id="deviceModel" name="deviceModel" label="Modelo do aparelho" required placeholder="Ex: iPhone 13, Redmi Note 12..." />
          <Input id="problemType" name="problemType" label="Problema" required placeholder="Ex: Tela quebrada, bateria viciada..." />
        </>
      )}
      <Textarea id="message" name="message" label="Mensagem" rows={4} />

      {status === 'error' && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === 'loading'} className={buttonStyles('primary', 'lg')}>
        {status === 'loading' ? 'Enviando...' : extraFields === 'reparo' ? 'Solicitar orçamento' : 'Enviar mensagem'}
      </button>
    </form>
  );
}
