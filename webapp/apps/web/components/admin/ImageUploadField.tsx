'use client';

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { assetUrl } from '../../lib/asset-url';

interface ImageUploadFieldProps {
  label: string;
  currentUrl: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function ImageUploadField({ label, currentUrl, onUpload }: ImageUploadFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const src = assetUrl(currentUrl);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      await onUpload(file);
    } catch {
      setError('Falha ao enviar imagem.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-1">
          {src && <Image src={src} alt="" fill className="object-contain p-1.5" />}
        </div>
        <label className="cursor-pointer rounded-xl border border-border px-3.5 py-2 text-sm text-text-muted hover:text-text hover:border-aki-green-500">
          {loading ? 'Enviando...' : 'Enviar imagem'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} disabled={loading} />
        </label>
      </div>
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
