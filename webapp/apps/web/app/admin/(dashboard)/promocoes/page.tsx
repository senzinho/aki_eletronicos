'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { promotionalBars } from '../../../../lib/api';
import type { PromotionalBar } from '../../../../lib/types';

export default function PromocoesPage() {
  const [items, setItems] = useState<PromotionalBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PromotionalBar | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await promotionalBars.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      text: String(form.get('text') ?? ''),
      icon: String(form.get('icon') ?? '') || undefined,
      ordering: Number(form.get('ordering') ?? 0),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      await promotionalBars.create(data);
    } else if (editing) {
      await promotionalBars.update(editing.id, data);
    }
    setEditing(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Barra promocional"
        description="Mensagens rotativas exibidas no topo do site."
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Nova mensagem
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Ícone', render: (p) => p.icon ?? '—' },
            { header: 'Texto', render: (p) => p.text },
            { header: 'Ordem', render: (p) => p.ordering },
            { header: 'Status', render: (p) => (p.isActive ? 'Ativa' : 'Inativa') },
            {
              header: 'Ações',
              render: (p) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(p)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await promotionalBars.remove(p.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(p) => p.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Nova mensagem' : 'Editar mensagem'}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="text" name="text" label="Texto" required defaultValue={editing && editing !== 'new' ? editing.text : ''} />
          <Input id="icon" name="icon" label="Ícone (emoji, opcional)" defaultValue={(editing && editing !== 'new' && editing.icon) || ''} />
          <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={editing && editing !== 'new' ? editing.ordering : 0} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Mensagem ativa
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}
