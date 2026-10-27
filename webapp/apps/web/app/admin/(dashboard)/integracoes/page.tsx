'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '../../../../components/admin/PageHeader';
import { Card } from '../../../../components/ui/Card';
import { Input, Textarea } from '../../../../components/ui/Field';
import { buttonStyles } from '../../../../components/ui/button-styles';
import { settings as settingsApi } from '../../../../lib/api';
import type { SiteSettings } from '../../../../lib/types';

export default function IntegracoesPage() {
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
    const payload = {
      gtm_id: String(form.get('gtm_id') ?? ''),
      ga4_id: String(form.get('ga4_id') ?? ''),
      custom_scripts_head: String(form.get('custom_scripts_head') ?? ''),
      custom_scripts_body: String(form.get('custom_scripts_body') ?? ''),
    };
    const updated = await settingsApi.update(payload);
    setValues(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return null;

  const siteUrl = values.app_url || 'http://localhost:3002';

  return (
    <div>
      <PageHeader
        title="Integrações"
        description="Google Tag Manager, GA4 e scripts de terceiros (ex: widget de IA). Esses scripts são carregados apenas no site público, nunca no admin."
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-2xl">
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="font-heading text-base font-semibold">Google</h2>
          <Input
            id="gtm_id"
            name="gtm_id"
            label="Google Tag Manager — Container ID"
            placeholder="GTM-XXXXXXX"
            defaultValue={values.gtm_id ?? ''}
          />
          <Input
            id="ga4_id"
            name="ga4_id"
            label="Google Analytics 4 — Measurement ID"
            placeholder="G-XXXXXXXXXX"
            hint="Preencha somente se não estiver usando o GA4 via GTM, para evitar contagem duplicada."
            defaultValue={values.ga4_id ?? ''}
          />
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <h2 className="font-heading text-base font-semibold">Scripts externos</h2>
          <p className="text-xs text-text-muted -mt-2">
            Cole aqui o código de terceiros (ex: widget de chat com IA, pixels de redes sociais). O conteúdo é
            inserido exatamente como colado — confira a procedência antes de salvar.
          </p>
          <Textarea
            id="custom_scripts_head"
            name="custom_scripts_head"
            label="Scripts no <head>"
            rows={6}
            placeholder="<script>...</script>"
            defaultValue={values.custom_scripts_head ?? ''}
          />
          <Textarea
            id="custom_scripts_body"
            name="custom_scripts_body"
            label="Scripts antes de </body>"
            rows={6}
            placeholder="<script>...</script>"
            hint="Use aqui widgets que precisam da página já carregada, como chat de IA."
            defaultValue={values.custom_scripts_body ?? ''}
          />
        </Card>

        <button type="submit" disabled={saving} className={buttonStyles('primary', 'md', 'self-start')}>
          {saving ? 'Salvando...' : saved ? 'Salvo ✓' : 'Salvar integrações'}
        </button>
      </form>

      <Card className="mt-6 max-w-2xl p-6 flex flex-col gap-2">
        <h2 className="font-heading text-base font-semibold mb-1">SEO — referência</h2>
        <p className="text-sm text-text-muted">
          Sitemap:{' '}
          <a className="text-aki-green-400 hover:underline" href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noopener">
            {siteUrl}/sitemap.xml
          </a>
        </p>
        <p className="text-sm text-text-muted">
          Robots:{' '}
          <a className="text-aki-green-400 hover:underline" href={`${siteUrl}/robots.txt`} target="_blank" rel="noopener">
            {siteUrl}/robots.txt
          </a>
        </p>
        <p className="text-xs text-text-muted mt-1">
          Gerados automaticamente a partir do catálogo publicado. Configure a URL do site em Configurações para que
          os links fiquem corretos em produção.
        </p>
      </Card>
    </div>
  );
}
