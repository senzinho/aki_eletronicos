'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { categories } from '../../../../lib/api';
import type { Category } from '../../../../lib/types';

export default function CategoriasPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await categories.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get('name') ?? ''),
      icon: String(form.get('icon') ?? '') || undefined,
      ordering: Number(form.get('ordering') ?? 0),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      await categories.create(data);
    } else if (editing) {
      await categories.update(editing.id, data);
    }
    setEditing(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Categorias"
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Nova categoria
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Nome', render: (c) => c.name },
            { header: 'Slug', render: (c) => <span className="text-text-muted">{c.slug}</span> },
            { header: 'Ordem', render: (c) => c.ordering },
            { header: 'Status', render: (c) => (c.isActive ? 'Ativa' : 'Inativa') },
            {
              header: 'Ações',
              render: (c) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(c)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await categories.remove(c.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(c) => c.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Nova categoria' : `Editar ${editing ? editing.name : ''}`}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="name" name="name" label="Nome" required defaultValue={editing && editing !== 'new' ? editing.name : ''} />
          <Input id="icon" name="icon" label="Ícone (chave)" defaultValue={(editing && editing !== 'new' && editing.icon) || ''} hint="smartphone, headphones, wrench, tag, sparkles..." />
          <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={editing && editing !== 'new' ? editing.ordering : 0} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Categoria ativa
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}
