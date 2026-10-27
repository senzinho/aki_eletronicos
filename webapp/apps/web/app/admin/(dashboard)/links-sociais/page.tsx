'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { socialLinks } from '../../../../lib/api';
import type { SocialLink } from '../../../../lib/types';

export default function LinksSociaisPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialLink | 'new' | null>(null);

  async function load() {
    setLoading(true);
    setItems(await socialLinks.listAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      platform: String(form.get('platform') ?? ''),
      url: String(form.get('url') ?? ''),
      isActive: form.get('isActive') === 'on',
    };
    if (editing === 'new') {
      await socialLinks.create(data);
    } else if (editing) {
      await socialLinks.update(editing.id, data);
    }
    setEditing(null);
    load();
  }

  return (
    <div>
      <PageHeader
        title="Redes sociais"
        action={
          <button type="button" onClick={() => setEditing('new')} className={buttonStyles('primary', 'sm')}>
            Novo link
          </button>
        }
      />

      {!loading && (
        <DataTable
          columns={[
            { header: 'Plataforma', render: (s) => s.platform },
            { header: 'URL', render: (s) => <span className="text-text-muted break-all">{s.url}</span> },
            { header: 'Status', render: (s) => (s.isActive ? 'Ativo' : 'Inativo') },
            {
              header: 'Ações',
              render: (s) => (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(s)} className="text-xs text-aki-green-400 hover:underline">
                    Editar
                  </button>
                  <ConfirmButton onConfirm={async () => { await socialLinks.remove(s.id); load(); }}>Excluir</ConfirmButton>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={(s) => s.id}
        />
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Novo link' : 'Editar link'}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="platform" name="platform" label="Plataforma" placeholder="instagram, facebook, tiktok..." required defaultValue={editing && editing !== 'new' ? editing.platform : ''} />
          <Input id="url" name="url" label="URL" type="url" required defaultValue={editing && editing !== 'new' ? editing.url : ''} />
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="isActive" defaultChecked={editing === 'new' ? true : editing?.isActive} className="h-4 w-4 accent-aki-green-500" />
            Link ativo
          </label>
          <button type="submit" className={buttonStyles('primary', 'md')}>
            Salvar
          </button>
        </form>
      </Modal>
    </div>
  );
}
