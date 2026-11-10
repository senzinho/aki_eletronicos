'use client';

import { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'aki-theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useLayoutEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme still applies for this session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      className="relative rounded-xl p-2.5 text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aki-green-400"
    >
      <span className="relative block h-[21px] w-[21px]">
        <Sun
          size={21}
          strokeWidth={1.8}
          className={clsx(
            'absolute inset-0 transition-all duration-300',
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0',
          )}
        />
        <Moon
          size={21}
          strokeWidth={1.8}
          className={clsx(
            'absolute inset-0 transition-all duration-300',
            theme === 'light' ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100',
          )}
        />
      </span>
    </button>
  );
}
