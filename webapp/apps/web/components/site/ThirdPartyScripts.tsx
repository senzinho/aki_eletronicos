import Script from 'next/script';

interface ThirdPartyScriptsProps {
  gtmId?: string;
  ga4Id?: string;
  customHead?: string;
}

/**
 * Loaded once, early, in the (site) layout only — never on /admin.
 * GTM/GA4 use next/script (afterInteractive) so they don't block rendering;
 * custom_scripts_head is pasted admin HTML, rendered as-is so inline <script>
 * tags inside it execute as part of normal HTML parsing.
 */
export function ThirdPartyScripts({ gtmId, ga4Id, customHead }: ThirdPartyScriptsProps) {
  return (
    <>
      {gtmId && (
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-base" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4Id}');`}
          </Script>
        </>
      )}
      {customHead && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: customHead }} />
      )}
    </>
  );
}

export function GtmNoscript({ gtmId }: { gtmId?: string }) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="gtm"
      />
    </noscript>
  );
}

export function CustomBodyScripts({ html }: { html?: string }) {
  if (!html) return null;
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
