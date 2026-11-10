import Image from 'next/image';
import { assetUrl } from '../../lib/asset-url';

interface BrandMarkProps {
  logoPath: string | null;
  companyName: string;
  size?: number;
}

/**
 * The Aki Eletrônicos ring mark is a light-background logo (green + black
 * two-tone). On dark surfaces the black half disappears, so the mark sits on
 * a small rounded chip tinted via --brand-chip-bg, which is only opaque in
 * the dark theme — in light mode it's transparent and the logo sits flush
 * with the page background.
 */
export function BrandMark({ logoPath, companyName, size = 36 }: BrandMarkProps) {
  const src = assetUrl(logoPath);
  if (!src) return null;

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: 'var(--brand-chip-bg)',
        boxShadow: 'var(--brand-chip-shadow)',
      }}
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
