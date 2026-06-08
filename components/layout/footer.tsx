'use client';

import Link from 'next/link';
import { DrippingText } from '../sewer/dripping-text';
import { useEffect, useState } from 'react';

const FOOTER_LINKS = {
  company: {
    title: 'Company',
    links: [
      { label: 'Blog',           href: '/blog' },
      { label: 'Careers',        href: '/careers' },
      { label: 'Brand Kit',      href: '/brand-kit' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Data Terms',     href: '/data-terms' },
    ],
  },
  social: {
    title: 'Social',
    links: [
      { label: 'X (Twitter)', href: 'https://twitter.com/DXMarkets', external: true },
      { label: 'Discord',     href: 'https://discord.gg/dxmarkets', external: true },
      { label: 'Telegram',    href: 'https://t.me/dxmarkets', external: true },
      { label: 'Instagram',   href: 'https://instagram.com/dxmarkets', external: true },
      { label: 'Reddit',      href: 'https://reddit.com/r/dxmarkets', external: true },
      { label: 'YouTube',     href: 'https://youtube.com/@dxmarkets', external: true },
    ],
  },
  product: {
    title: 'Product',
    links: [
      { label: 'Help Center',          href: '/help' },
      { label: 'API Docs',             href: '/api-docs' },
      { label: 'FAQ',                  href: '/faq' },
      { label: 'Fee Schedule',         href: '/fees' },
      { label: 'Trading Rules',        href: '/trading-rules' },
      { label: 'Incentive Program',    href: '/incentives' },
      { label: 'Responsible Trading',  href: '/responsible-trading' },
      { label: 'Market Integrity',     href: '/market-integrity' },
    ],
  },
  ecosystem: {
    title: 'Ecosystem',
    links: [
      { label: 'DatXit',        href: 'https://datxit.com', external: true },
      { label: 'El Shito',      href: 'https://elshito.xyz', external: true },
      { label: '$DATX Token',   href: '/token' },
      { label: 'Burn Tracker',  href: '/burn-tracker' },
      { label: 'SDK',           href: '/api-docs#sdk' },
      { label: 'Smart Contracts', href: '/contracts' },
    ],
  },
};

export function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <footer className="relative z-10 mt-auto bg-[#0a0012]/80 backdrop-blur-sm border-t border-[rgba(255,0,170,0.2)]">
      {/* Main link grid */}
      <div className="max-w-screen-2xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a0a0ff] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={'external' in link && link.external ? '_blank' : undefined}
                      rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-[#7070a0] hover:text-[#ff00aa] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(255,0,170,0.12)] px-4 py-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <DrippingText as="span" className="text-base font-display" glowColor="pink">
            DXMarkets
          </DrippingText>

          <p className="text-xs text-[#5a5a8a] text-center max-w-2xl leading-relaxed">
            Trading on DXMarkets involves risk. Prediction markets are speculative instruments.
            $DATX is a utility token. Nothing here constitutes financial advice.
            Past performance is not indicative of future results. Sewer at your own risk.
          </p>

          <p className="text-xs text-[#5a5a8a] shrink-0">
            © 2025-2026 DatXit Ecosystem.{' '}
            <span className="text-[#ff00aa]">Proudly the shittiest.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

