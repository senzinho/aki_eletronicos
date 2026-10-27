'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { ImageUploadField } from '../../../../components/admin/ImageUploadField';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { banners } from '../../../../lib/api';
import type { Banner } from '../../../../lib/types';

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await banners.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      internalName: String(form.get('internalName') ?? ''),
      title: String(form.get('title') ?? '') || undefined,
      subtitle: String(form.get('subtitle') ?? '') || undefined,
      ctaText: String(form.get('ctaText') ?? '') || undefined,
      url: String(form.get('url') ?? '') || undefined,
      ordering: Number(form.get('ordering') ?? 0),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      const created = await banners.create(data);
      setEditing(created);
    } else if (editing) {
      await banners.update(editing.id, data);
    }
    load();
  }

  return (
    <div>
      <PageHeader
        title="Banners"
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Novo banner
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Nome interno', render: (b) => b.internalName },
            { header: 'Título', render: (b) => b.title ?? '—' },
            { header: 'Ordem', render: (b) => b.ordering },
            { header: 'Status', render: (b) => (b.isActive ? 'Ativo' : 'Inativo') },
            {
              header: 'Ações',
              render: (b) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(b)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await banners.remove(b.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(b) => b.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Novo banner' : 'Editar banner'}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="internalName" name="internalName" label="Nome interno" required defaultValue={editing && editing !== 'new' ? editing.internalName : ''} />
          <Input id="title" name="title" label="Título" defaultValue={(editing && editing !== 'new' && editing.title) || ''} />
          <Input id="subtitle" name="subtitle" label="Subtítulo" defaultValue={(editing && editing !== 'new' && editing.subtitle) || ''} />
          <Input id="ctaText" name="ctaText" label="Texto do botão" defaultValue={(editing && editing !== 'new' && editing.ctaText) || ''} />
          <Input id="url" name="url" label="Link de destino" defaultValue={(editing && editing !== 'new' && editing.url) || ''} />
          <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={editing && editing !== 'new' ? editing.ordering : 0} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Banner ativo
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>

        {editing && editing !== 'new' && (
          <div className="mt-6 flex flex-col gap-5 border-t border-border pt-5">
            <ImageUploadField
              label="Imagem desktop"
              currentUrl={editing.imageDesktop}
              onUpload={async (file) => {
                const updated = await banners.uploadDesktop(editing.id, file);
                setEditing(updated);
                load();
              }}
            />
            <ImageUploadField
              label="Imagem mobile"
              currentUrl={editing.imageMobile}
              onUpload={async (file) => {
                const updated = await banners.uploadMobile(editing.id, file);
                setEditing(updated);
                load();
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
