'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../../../components/ui/Field';
import { buttonStyles } from '../../../components/ui/button-styles';
import { Card } from '../../../components/ui/Card';
import { ApiError, auth } from '../../../lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      await auth.login(String(form.get('username') ?? ''), String(form.get('password') ?? ''));
      const next = searchParams.get('next') || '/admin';
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input id="username" name="username" label="Usuário" required autoComplete="username" autoFocus />
      <Input id="password" name="password" label="Senha" type="password" required autoComplete="current-password" />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className={buttonStyles('primary', 'md')}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="font-heading text-xl font-bold mb-1">Painel administrativo</h1>
        <p className="text-sm text-text-muted mb-6">Aki Eletrônicos</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
