'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { DataTable } from '../../../../components/admin/DataTable';
import { ConfirmButton } from '../../../../components/admin/ConfirmButton';
import { ImageUploadField } from '../../../../components/admin/ImageUploadField';
import { Card } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { banners, settings as settingsApi } from '../../../../lib/api';
import type { Banner, SiteSettings } from '../../../../lib/types';

function OfertasBannerSlot({
  title,
  slotKey,
  siteSettings,
  enabled,
  onToggle,
  onUpload,
}: {
  title: string;
  slotKey: 'ofertas_banner_topo' | 'ofertas_banner_produtos';
  siteSettings: SiteSettings;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <label className="flex items-center gap-2 text-sm font-medium text-text">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 accent-aki-green-500"
        />
        {title}
      </label>
      {enabled ? (
        <>
          <ImageUploadField label="Imagem do banner" currentUrl={siteSettings[slotKey] || null} onUpload={onUpload} />
          <p className="text-xs text-text-muted">
            Tamanho de referência: 1600×400px (proporção larga). A imagem se adapta automaticamente a telas menores.
          </p>
          <Input
            id={`${slotKey}_url`}
            name={`${slotKey}_url`}
            label="Link ao clicar (opcional)"
            placeholder="https://..."
            defaultValue={siteSettings[`${slotKey}_url`] ?? ''}
          />
        </>
      ) : (
        <p className="text-xs text-text-muted">Desativado — nada é exibido nesse espaço no site.</p>
      )}
    </div>
  );
}

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | 'new' | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [topoEnabled, setTopoEnabled] = useState(false);
  const [produtosEnabled, setProdutosEnabled] = useState(false);
  const [savingSlots, setSavingSlots] = useState(false);
  const [slotsSaved, setSlotsSaved] = useState(false);

  async function load() {
    setLoading(true);
    setItems(await banners.listAdmin());
    setLoading(false);
  }

  async function loadSettings() {
    const s = await settingsApi.get();
    setSiteSettings(s);
    setTopoEnabled(s.ofertas_banner_topo_enabled === '1');
    setProdutosEnabled(s.ofertas_banner_produtos_enabled === '1');
    setSettingsLoaded(true);
  }

  useEffect(() => {
    load();
    loadSettings();
  }, []);

  async function onSlotsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingSlots(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      ofertas_banner_topo_enabled: topoEnabled ? '1' : '',
      ofertas_banner_topo_url: String(form.get('ofertas_banner_topo_url') ?? ''),
      ofertas_banner_produtos_enabled: produtosEnabled ? '1' : '',
      ofertas_banner_produtos_url: String(form.get('ofertas_banner_produtos_url') ?? ''),
    };
    const updated = await settingsApi.update(payload);
    setSiteSettings(updated);
    setSavingSlots(false);
    setSlotsSaved(true);
    setTimeout(() => setSlotsSaved(false), 2000);
  }

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

      {settingsLoaded && (
        <Card className="mt-6 max-w-2xl p-6">
          <h2 className="font-heading text-base font-semibold mb-1">Banners da página Ofertas</h2>
          <p className="text-sm text-text-muted mb-4">
            Controle os espaços de banner da página /ofertas. Desativado = nada é exibido nesse espaço.
          </p>
          <form onSubmit={onSlotsSubmit} className="flex flex-col gap-4">
            <OfertasBannerSlot
              title="Banner no topo da página"
              slotKey="ofertas_banner_topo"
              siteSettings={siteSettings}
              enabled={topoEnabled}
              onToggle={setTopoEnabled}
              onUpload={async (file) => setSiteSettings(await settingsApi.uploadImage('ofertas_banner_topo', file))}
            />
            <OfertasBannerSlot
              title="Banner acima da lista de produtos"
              slotKey="ofertas_banner_produtos"
              siteSettings={siteSettings}
              enabled={produtosEnabled}
              onToggle={setProdutosEnabled}
              onUpload={async (file) => setSiteSettings(await settingsApi.uploadImage('ofertas_banner_produtos', file))}
            />
            <button type="submit" disabled={savingSlots} className={buttonStyles('primary', 'md', 'self-start')}>
              {savingSlots ? 'Salvando...' : slotsSaved ? 'Salvo ✓' : 'Salvar banners de Ofertas'}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
}
