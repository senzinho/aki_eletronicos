import Image from 'next/image';
import { assetUrl } from '../../lib/asset-url';

interface BrandMarkProps {
  logoPath: string | null;
  companyName: string;
  size?: number;
}

/**
 * The Aki Eletrônicos ring mark is a light-background logo (green + black
 * two-tone). On the site's dark surfaces the black half disappears, so the
 * mark sits on a small rounded light chip to stay fully legible without
 * altering the logo's own colors.
 */
export function BrandMark({ logoPath, companyName, size = 36 }: BrandMarkProps) {
  const src = assetUrl(logoPath);
  if (!src) return null;

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="h-[78%] w-[78%] object-contain"
        priority
      />
    </span>
  );
}
