import Image from 'next/image';
import Link from 'next/link';
import { assetUrl } from '../../lib/asset-url';

interface LogoProps {
  logoPath: string | null;
  companyName: string;
}

export function Logo({ logoPath, companyName }: LogoProps) {
  const src = assetUrl(logoPath);
  return (
    <Link href="/" aria-label={`${companyName} — página inicial`} className="flex items-center gap-2 shrink-0">
      {src ? (
        <Image
          src={src}
          alt={companyName}
          width={160}
          height={36}
          className="h-8 w-auto object-contain"
          priority
        />
      ) : (
        <span className="font-heading text-lg font-bold tracking-tight text-text">
          {companyName}
        </span>
      )}
    </Link>
  );
}
