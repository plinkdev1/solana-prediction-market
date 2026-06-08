'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Trending',      href: '/bets?sort=trending' },
  { label: 'Crypto',        href: '/bets?category=crypto' },
  { label: 'Political',     href: '/bets?category=political' },
  { label: 'Sports',        href: '/bets?category=sports' },
  { label: 'Tech',          href: '/bets?category=tech' },
  { label: 'Elections',     href: '/bets?category=elections' },
  { label: 'El Shito',      href: '/bets?category=el-shito' },
  { label: 'DatXit',        href: '/bets?category=datxit' },
  { label: 'Satirical',     href: '/bets?category=satirical' },
  { label: 'Xitmas',        href: '/bets?category=xitmas' },
  { label: 'Market Trends', href: '/bets?category=market-trends' },
  { label: 'Custom',        href: '/bets?category=custom' },
];

export function CategoryNav() {
  const pathname = usePathname();

  // Only show on market-adjacent pages
  const showOn = ['/', '/bets', '/markets'];
  const show = showOn.some(p => pathname === p || pathname.startsWith('/markets'));
  if (!show) return null;

  return (
    <nav
      aria-label="Market categories"
      className="category-nav relative z-20 bg-[#0a0012]/95 backdrop-blur-md px-4"
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="category-nav-item"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
