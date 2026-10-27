export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3012';
    return `${base}${path}`;
  }
  return path;
}
