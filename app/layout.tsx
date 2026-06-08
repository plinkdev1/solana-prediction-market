import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Bangers } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { SewerBg } from '@/components/layout/sewer-bg';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryNav } from '@/components/layout/category-nav';
import { AgeGateModal } from '@/components/compliance/age-gate-modal';
import { CookieBanner } from '@/components/compliance/cookie-banner';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'DXMarkets — Sewer Bets on Solana',
    template: '%s | DXMarkets',
  },
  description: 'Satirical prediction markets on Solana. Multi-token betting with $DATX, SOL, USDC. Lore markets, flash bets, and sewer chaos.',
  keywords: ['Solana', 'Prediction Markets', 'DatXit', 'DATX', 'Betting', 'Satirical', 'El Shito', 'Crypto'],
  metadataBase: new URL('https://dxmarkets.xyz'),
  openGraph: {
    title: 'DXMarkets — Sewer Bets on Solana',
    description: 'The shittiest prediction markets on Solana.',
    type: 'website',
    siteName: 'DXMarkets',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@DXMarkets',
    title: 'DXMarkets — Sewer Bets on Solana',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0012',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const segmentWriteKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY ?? '';
  const mixpanelToken   = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${bangers.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">

        {/* Segment analytics loader */}
        {segmentWriteKey && (
          <Script id="segment-analytics" strategy="afterInteractive">{`
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/"+key+"/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${segmentWriteKey}";analytics.load("${segmentWriteKey}");analytics.page();}}();
          `}</Script>
        )}

        {/* Mixpanel loader */}
        {mixpanelToken && (
          <Script id="mixpanel-analytics" strategy="afterInteractive">{`
            (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
            mixpanel.init("${mixpanelToken}", {track_pageview: true, persistence: "localStorage"});
          `}</Script>
        )}

        <SewerBg />
        <Header />
        <CategoryNav />
        <main className="relative z-10 flex-1">
          {children}
        </main>
        <Footer />
        <AgeGateModal />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
