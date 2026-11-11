import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { assetUrl } from "../lib/asset-url";
import { settings } from "../lib/api";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('aki-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {}
})();
`;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const DEFAULT_TITLE = "Aki Eletrônicos";
const DEFAULT_DESCRIPTION =
  "Especializada em celulares: venda de smartphones Apple, Xiaomi, Samsung, acessórios e assistência técnica especializada em Colombo/PR.";

export async function generateMetadata(): Promise<Metadata> {
  // Falls back to defaults if the API isn't reachable yet (e.g. during a Docker build).
  const s = await settings.get().catch(() => ({}) as Record<string, string>);
  const ogImage = assetUrl(s.og_image || null);
  const favicon = assetUrl(s.favicon || s.logo || null) || "/images/favicon.png";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"),
    title: {
      default: s.seo_title || DEFAULT_TITLE,
      template: `%s | ${s.nome_empresa || DEFAULT_TITLE}`,
    },
    description: s.seo_description || DEFAULT_DESCRIPTION,
    icons: {
      icon: favicon,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: s.nome_empresa || DEFAULT_TITLE,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
    verification: s.google_site_verification ? { google: s.google_site_verification } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
