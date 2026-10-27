'use client';

import { buttonStyles } from '../../components/ui/button-styles';

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-2xl font-bold">Algo deu errado ao carregar esta página</h1>
      <p className="text-text-muted max-w-sm">
        Pode ter sido uma falha temporária de conexão. Tente novamente em instantes.
      </p>
      <button type="button" onClick={() => reset()} className={buttonStyles('primary', 'md')}>
        Tentar novamente
      </button>
    </div>
  );
}
