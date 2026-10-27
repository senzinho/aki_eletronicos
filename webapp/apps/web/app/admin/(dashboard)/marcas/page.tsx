'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { ImageUploadField } from '../../../../components/admin/ImageUploadField';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { brands } from '../../../../lib/api';
import { assetUrl } from '../../../../lib/asset-url';
import type { Brand } from '../../../../lib/types';

export default function MarcasPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await brands.listAdmin());
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
      link: String(form.get('link') ?? '') || undefined,
      ordering: Number(form.get('ordering') ?? 0),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      const created = await brands.create(data);
      setEditing(created);
    } else if (editing) {
      await brands.update(editing.id, data);
    }
    load();
  }

  return (
    <div>
      <PageHeader
        title="Marcas"
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Nova marca
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            {
              header: 'Logo',
              render: (b) => {
                const src = assetUrl(b.logo);
                return src ? (
                  <div className="relative h-8 w-16">
                    <Image src={src} alt="" fill className="object-contain" />
                  </div>
                ) : (
                  <span className="text-text-muted">—</span>
                );
              },
            },
            { header: 'Nome', render: (b) => b.name },
            { header: 'Ordem', render: (b) => b.ordering },
            { header: 'Status', render: (b) => (b.isActive ? 'Ativa' : 'Inativa') },
            {
              header: 'Ações',
              render: (b) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(b)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await brands.remove(b.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(b) => b.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Nova marca' : `Editar ${editing ? editing.name : ''}`}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="name" name="name" label="Nome" required defaultValue={editing && editing !== 'new' ? editing.name : ''} />
          <Input id="link" name="link" label="Link (opcional)" defaultValue={(editing && editing !== 'new' && editing.link) || ''} />
          <Input id="ordering" name="ordering" label="Ordem" type="number" defaultValue={editing && editing !== 'new' ? editing.ordering : 0} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Marca ativa
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>

        {editing && editing !== 'new' && (
          <div className="mt-6 border-t border-border pt-5">
            <ImageUploadField
              label="Logo da marca"
              currentUrl={editing.logo}
              onUpload={async (file) => {
                const updated = await brands.uploadLogo(editing.id, file);
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
