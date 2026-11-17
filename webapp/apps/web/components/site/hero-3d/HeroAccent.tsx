import type { ReactNode } from 'react';

/** Green, softly glowing emphasis for part of a 3D-hero headline. */
export function HeroAccent({ children }: { children: ReactNode }) {
  return (
    <em className="not-italic text-aki-green-400" style={{ textShadow: '0 0 30px rgba(47,211,92,.4)' }}>
      {children}
    </em>
  );
}
