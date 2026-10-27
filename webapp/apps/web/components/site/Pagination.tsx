import Link from 'next/link';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1.5 pt-10">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={clsx(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors',
          page === 1 ? 'pointer-events-none text-text-muted/40' : 'text-text-muted hover:text-text',
        )}
      >
        <ChevronLeft size={16} strokeWidth={2} />
        <span className="hidden sm:inline">Anterior</span>
      </Link>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-text-muted/50 px-1">…</span>}
          <Link
            href={buildHref(p)}
            aria-current={p === page ? 'page' : undefined}
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200',
              p === page ? 'bg-aki-green-500 text-text-on-green' : 'text-text-muted hover:bg-surface-2 hover:text-text',
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={clsx(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors',
          page === totalPages ? 'pointer-events-none text-text-muted/40' : 'text-text-muted hover:text-text',
        )}
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight size={16} strokeWidth={2} />
      </Link>
    </nav>
  );
}
