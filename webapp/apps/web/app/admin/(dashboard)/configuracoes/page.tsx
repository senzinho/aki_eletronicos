'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { ImageUploadField } from '../../../../components/admin/ImageUploadField';
import { Card } from '../../../../components/ui/Card';
import { Input, Textarea } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { settings as settingsApi } from '../../../../lib/api';
import type { SiteSettings } from '../../../../lib/types';

const TEXT_FIELDS: { key: keyof SiteSettings; label: string; hint?: string }[] = [
  { key: 'nome_empresa', label: 'Nome da empresa' },
  { key: 'app_url', label: 'URL do site', hint: 'Ex: https://akieletronicos.com.br (usado em SEO/canonical)' },
  { key: 'whatsapp', label: 'WhatsApp', hint: 'Somente números, com DDI e DDD. Ex: 5541998132536' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'E-mail' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'google_maps', label: 'URL do Google Maps (embed)' },
  { key: 'instagram', label: 'Instagram (URL)' },
  { key: 'facebook', label: 'Facebook (URL)' },
  { key: 'tiktok', label: 'TikTok (URL)' },
  { key: 'horario_atendimento', label: 'Horário de atendimento' },
];

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    setValues(await settingsApi.get());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const { key } of TEXT_FIELDS) payload[key] = String(form.get(key) ?? '');
    payload.seo_title = String(form.get('seo_title') ?? '');
    payload.seo_description = String(form.get('seo_description') ?? '');
    const updated = await settingsApi.update(payload);
    setValues(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return null;

  return (
    <div>
      <PageHeader title="Configurações" description="Dados usados em todo o site: contato, redes sociais e SEO padrão." />

      <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-2xl">
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="font-heading text-base font-semibold">Dados da loja</h2>
          {TEXT_FIELDS.map((f) => (
            <Input key={f.key} id={f.key} name={f.key} label={f.label} hint={f.hint} defaultValue={values[f.key] ?? ''} />
          ))}
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="font-heading text-base font-semibold">SEO padrão</h2>
          <Input id="seo_title" name="seo_title" label="Título (meta title)" defaultValue={values.seo_title ?? ''} />
          <Textarea id="seo_description" name="seo_description" label="Descrição (meta description)" defaultValue={values.seo_description ?? ''} />
        </Card>

        <button type="submit" disabled={saving} className={buttonStyles('primary', 'md', 'self-start')}>
          {saving ? 'Salvando...' : saved ? 'Salvo ✓' : 'Salvar configurações'}
        </button>
      </form>

      <Card className="mt-6 p-6 flex flex-col gap-5 max-w-2xl">
        <h2 className="font-heading text-base font-semibold">Imagens e vídeo</h2>
        <ImageUploadField
          label="Logo"
          currentUrl={values.logo || null}
          onUpload={async (file) => setValues(await settingsApi.uploadImage('logo', file))}
        />
        <ImageUploadField
          label="Favicon"
          currentUrl={values.favicon || null}
          onUpload={async (file) => setValues(await settingsApi.uploadImage('favicon', file))}
        />
        <ImageUploadField
          label="Imagem de compartilhamento (og:image)"
          currentUrl={values.og_image || null}
          onUpload={async (file) => setValues(await settingsApi.uploadImage('og_image', file))}
        />
        <ImageUploadField
          label="Imagem de capa do vídeo (hero)"
          currentUrl={values.hero_video_poster || null}
          onUpload={async (file) => setValues(await settingsApi.uploadImage('hero_video_poster', file))}
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">Vídeo do hero (MP4/WebM, até 60MB)</span>
          <label className="cursor-pointer self-start rounded-xl border border-border px-3.5 py-2 text-sm text-text-muted hover:text-text hover:border-aki-green-500">
            {values.hero_video ? 'Trocar vídeo' : 'Enviar vídeo'}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setValues(await settingsApi.uploadVideo('hero_video', file));
                e.target.value = '';
              }}
            />
          </label>
          {values.hero_video && <span className="text-xs text-text-muted">Vídeo atual: {values.hero_video}</span>}
        </div>

        <ImageUploadField
          label="Imagem de capa do vídeo (seção Conheça a loja)"
          currentUrl={values.about_video_poster || null}
          onUpload={async (file) => setValues(await settingsApi.uploadImage('about_video_poster', file))}
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">Vídeo da seção &quot;Conheça a loja&quot; (MP4/WebM, até 60MB)</span>
          <label className="cursor-pointer self-start rounded-xl border border-border px-3.5 py-2 text-sm text-text-muted hover:text-text hover:border-aki-green-500">
            {values.about_video ? 'Trocar vídeo' : 'Enviar vídeo'}
            <input
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setValues(await settingsApi.uploadVideo('about_video', file));
                e.target.value = '';
              }}
            />
          </label>
          {values.about_video && <span className="text-xs text-text-muted">Vídeo atual: {values.about_video}</span>}
        </div>
      </Card>
    </div>
  );
}
