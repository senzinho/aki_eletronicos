'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { Modal } from '../../../../components/ui/Modal';
import { Input, Textarea } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { testimonials } from '../../../../lib/api';
import type { Testimonial } from '../../../../lib/types';

export default function DepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await testimonials.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      authorName: String(form.get('authorName') ?? ''),
      rating: Number(form.get('rating') ?? 5),
      comment: String(form.get('comment') ?? ''),
      context: String(form.get('context') ?? '') || undefined,
      ordering: Number(form.get('ordering') ?? 0),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      await testimonials.create(data);
    } else if (editing) {
      await testimonials.update(editing.id, data);
    }
    setEditing(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Depoimentos"
        description="Depoimentos reais de clientes — nunca cadastre avaliações fictícias."
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Novo depoimento
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Autor', render: (t) => t.authorName },
            { header: 'Nota', render: (t) => `${t.rating}/5` },
            { header: 'Comentário', render: (t) => <span className="text-text-muted line-clamp-1 max-w-xs">{t.comment}</span> },
            { header: 'Status', render: (t) => (t.isActive ? 'Ativo' : 'Inativo') },
            {
              header: 'Ações',
              render: (t) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(t)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await testimonials.remove(t.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(t) => t.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Novo depoimento' : 'Editar depoimento'}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="authorName" name="authorName" label="Nome do cliente" required defaultValue={editing && editing !== 'new' ? editing.authorName : ''} />
          <Input id="rating" name="rating" label="Nota (1 a 5)" type="number" min={1} max={5} required defaultValue={editing && editing !== 'new' ? editing.rating : 5} />
          <Textarea id="comment" name="comment" label="Comentário" required defaultValue={editing && editing !== 'new' ? editing.comment : ''} />
          <Input id="context" name="context" label="Contexto (opcional)" placeholder="Ex: Troca de tela do iPhone 13" defaultValue={(editing && editing !== 'new' && editing.context) || ''} />
          <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={editing && editing !== 'new' ? editing.ordering : 0} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Exibir no site
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}
