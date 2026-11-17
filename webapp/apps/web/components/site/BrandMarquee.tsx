import clsx from 'clsx';

interface Brand {
  name: string;
  /** Silhouette in /public/images/brands, sized from its viewBox. Brands without one render as a wordmark. */
  logo?: { file: string; width: number; height: number };
}

// 0.38 keeps the very different logo shapes (wide AMD/Asus vs. square MSI/Corsair) optically balanced.
const S = 0.38;
const logo = (file: string, w: number, h: number) => ({ file, width: Math.round(w * S), height: Math.round(h * S) });

/** Every silhouette we ship in /public/images/brands, keyed by lowercase brand name. */
const LOGOS = {
  intel: logo('intel', 338, 133),
  amd: logo('amd', 444, 109),
  asus: logo('asus', 444, 95),
  msi: logo('msi', 110, 133),
  corsair: logo('corsair', 138, 133),
  hyperx: logo('hyperx', 234, 134),
  xiaomi: logo('xiaomi', 134, 134),
  apple: logo('apple', 110, 134),
  samsung: logo('samsung', 444, 71),
  jbl: logo('jbl', 235, 134),
};

export const PC_BRANDS: Brand[] = [
  { name: 'Intel', logo: LOGOS.intel },
  { name: 'AMD', logo: LOGOS.amd },
  { name: 'Gigabyte' },
  { name: 'Asus', logo: LOGOS.asus },
  { name: 'MSI', logo: LOGOS.msi },
  { name: 'ASRock' },
  { name: 'Corsair', logo: LOGOS.corsair },
  { name: 'HyperX', logo: LOGOS.hyperx },
  { name: 'Aigo' },
];

export const PHONE_BRANDS: Brand[] = [
  { name: 'Xiaomi', logo: LOGOS.xiaomi },
  { name: 'Apple', logo: LOGOS.apple },
  { name: 'Samsung', logo: LOGOS.samsung },
  { name: 'JBL', logo: LOGOS.jbl },
];

const ALIASES: Record<string, keyof typeof LOGOS> = { iphone: 'apple' };
const lookupKey = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** Brand names typed in the admin → marquee tiles: our logo when we have one, a plain wordmark otherwise. */
export function brandsFromNames(names: string[]): Brand[] {
  return names.map((name) => {
    const key = lookupKey(name);
    const id = key in LOGOS ? (key as keyof typeof LOGOS) : ALIASES[key];
    return { name, logo: id ? LOGOS[id] : undefined };
  });
}

function BrandTile({ brand }: { brand: Brand }) {
  return (
    <li
      className={clsx(
        'group relative flex h-24 min-w-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-1/70 px-8',
        'text-text-muted transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-aki-green-500/60 hover:text-aki-green-400 hover:shadow-[0_14px_34px_rgba(47,211,92,0.14)]',
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(47,211,92,0.16),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {brand.logo ? (
        <span
          role="img"
          aria-label={brand.name}
          className="brand-logo relative block transition-transform duration-300 group-hover:scale-110"
          style={{
            width: brand.logo.width,
            height: brand.logo.height,
            ['--logo' as string]: `url(/images/brands/${brand.logo.file}.svg)`,
          }}
        />
      ) : (
        <span className="relative font-heading text-lg font-semibold tracking-wide transition-transform duration-300 group-hover:scale-110">
          {brand.name}
        </span>
      )}
    </li>
  );
}

function Row({ brands, reverse, seconds }: { brands: Brand[]; reverse?: boolean; seconds: number }) {
  // A set must be wider than the screen (~11rem tiles) or the track would run out mid-loop.
  const set = Array.from({ length: Math.max(1, Math.ceil(12 / brands.length)) }, () => brands).flat();
  // Two identical sets; the track slides by exactly one set (-50%) so the loop has no seam.
  return (
    <div className="marquee">
      <div
        className={clsx('marquee-track', reverse && 'marquee-reverse')}
        style={{ ['--marquee-duration' as string]: `${seconds}s` }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1 ? true : undefined}>
            {set.map((brand, i) => (
              <BrandTile key={`${brand.name}-${i}`} brand={brand} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  return (
    <div className="flex flex-col gap-4" aria-label="Marcas com que trabalhamos">
      <Row brands={brands} seconds={Math.max(40, brands.length * 5.5)} />
      <Row brands={[...brands].reverse()} seconds={Math.max(48, brands.length * 6.5)} reverse />
    </div>
  );
}
