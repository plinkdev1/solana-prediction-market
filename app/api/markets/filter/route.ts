import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketType = searchParams.get('type'); // 'lore' | 'fast' | null
  const category = searchParams.get('category'); // category name or null
  const search = searchParams.get('search'); // search query or null

  // Import from lib (in production, would query Supabase)
  const { MOCK_MARKETS } = await import('@/lib/mock-data');

  let filtered = MOCK_MARKETS;

  // Filter by market type
  if (marketType && marketType !== 'all') {
    filtered = filtered.filter((m) => m.market_type === marketType);
  }

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((m) => m.category === category);
  }

  // Filter by search query
  if (search && search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    markets: filtered,
  });
}
