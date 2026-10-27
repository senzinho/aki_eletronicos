'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleContent?: ReactNode;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, titleContent, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="m-0 ml-auto h-dvh max-h-dvh w-[min(400px,88vw)] max-w-none border-l border-border bg-surface-2 p-0 text-text backdrop:bg-black/70 open:animate-[drawer-in_280ms_cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        {titleContent ?? <h2 className="font-heading text-lg font-semibold">{title}</h2>}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-1 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
      <div className="h-[calc(100%-65px)] overflow-y-auto px-5 py-5">{children}</div>
    </dialog>
  );
}
