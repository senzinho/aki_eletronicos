import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg' | 'sm';

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold font-heading transition-all duration-200 ease-out cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    size === 'lg' && 'h-14 px-8 text-base',
    size === 'md' && 'h-12 px-6 text-sm',
    size === 'sm' && 'h-10 px-4 text-sm',
    variant === 'primary' &&
      'aki-gradient text-text-on-green hover:brightness-110 hover:aki-glow active:brightness-95',
    variant === 'secondary' &&
      'bg-transparent border border-aki-green-500 text-text hover:bg-aki-green-500/10',
    variant === 'whatsapp' &&
      'bg-aki-green-500 text-text-on-green hover:bg-aki-green-400 hover:aki-glow active:bg-aki-green-600',
    variant === 'ghost' && 'bg-transparent text-text-muted hover:text-text hover:bg-surface-2',
    variant === 'danger' && 'bg-danger text-white hover:brightness-110',
    className,
  );
}
