import Link from 'next/link';
import { BrandMark } from './BrandMark';

interface LogoProps {
  logoPath: string | null;
  companyName: string;
}

export function Logo({ logoPath, companyName }: LogoProps) {
  return (
    <Link href="/" aria-label={`${companyName} — página inicial`} className="flex items-center gap-2.5 shrink-0">
      <BrandMark logoPath={logoPath} companyName={companyName} size={36} />
      <span className="hidden font-heading text-base font-bold tracking-tight text-text sm:inline">
        {companyName}
      </span>
    </Link>
  );
}
