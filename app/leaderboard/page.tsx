'use client';

import { useState, useEffect } from 'react';
import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { formatNumber } from '@/lib/format-utils';
import { MOCK_LEADERBOARD } from '@/lib/mock-data';
import { Trophy, TrendingUp, RefreshCw } from 'lucide-react';

const PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'all_time', label: 'All Time' },
] as const;

type LeaderboardEntry = {
  rank: number;
  wallet: string;
  username?: string;
  profit: number;
  volume?: number;
  win_rate: number;
  markets_traded: number;
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<string>('all_time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?period=${period}`);
        if (res.ok) {
          const data = await res.json();
          if (data.leaderboard && data.leaderboard.length > 0) {
            setEntries(data.leaderboard);
            setIsCached(data.cached || false);
            setLastUpdated(data.updated_at || null);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to mock data
      }
      setEntries(MOCK_LEADERBOARD);
      setIsCached(false);
      setLastUpdated(null);
      setLoading(false);
    }

    fetchLeaderboard();
  }, [period, isMounted]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <DrippingText as="h1" className="text-3xl md:text-4xl mb-2" glowColor="orange">
            Shittiest Oracles
          </DrippingText>
          <p className="text-[#a0a0ff]">The real rulers exposed.</p>
        </div>

        {/* Period Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                period === p.value
                  ? 'bg-[#ff6600] text-[#0a0012] border-[#ff6600] shadow-[0_0_15px_rgba(255,102,0,0.5)]'
                  : 'bg-transparent text-[#ff6600] border-[#ff6600]/30 hover:border-[#ff6600] hover:bg-[#ff6600]/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Cache indicator */}
        {isMounted && lastUpdated && (
          <div className="flex items-center justify-center gap-2 text-xs text-[#a0a0ff]">
            <RefreshCw className="w-3 h-3" />
            <span>
              {isCached ? 'Cached' : 'Live'} - Updated{' '}
              {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Leaderboard Table */}
        <NeonCard glowColor="orange" className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-[#ff6600] animate-spin" />
              <span className="ml-3 text-[#a0a0ff]">Loading rankings from the sewer...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#ff6600]/30">
                  <th className="text-left py-3 px-2 text-[#ff6600] text-xs uppercase font-bold">Rank</th>
                  <th className="text-left py-3 px-2 text-[#ff6600] text-xs uppercase font-bold">Wallet</th>
                  <th className="text-right py-3 px-2 text-[#ff6600] text-xs uppercase font-bold">Win Rate</th>
                  <th className="text-right py-3 px-2 text-[#ff6600] text-xs uppercase font-bold">Profit</th>
                  <th className="text-right py-3 px-2 text-[#ff6600] text-xs uppercase font-bold">Markets</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.rank}
                    className="border-b border-[#ff6600]/10 hover:bg-[#ff6600]/5 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {entry.rank <= 3 && (
                          <Trophy
                            className={`w-5 h-5 ${
                              entry.rank === 1
                                ? 'text-[#ff00aa]'
                                : entry.rank === 2
                                ? 'text-[#00ffcc]'
                                : 'text-[#ff6600]'
                            }`}
                          />
                        )}
                        <span className="text-[#f0f0f0] font-bold text-lg">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        {entry.username && (
                          <span className="text-[#ff00aa] text-sm block">{entry.username}</span>
                        )}
                        <span className="text-[#f0f0f0] font-mono text-xs">{entry.wallet}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4 text-[#00ffcc]" />
                        <span className="text-[#00ffcc] font-bold">
                          {typeof entry.win_rate === 'number' ? entry.win_rate.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-[#ff00aa] font-bold">+{formatNumber(entry.profit)}</span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-[#a0a0ff]">{entry.markets_traded}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </NeonCard>

        <div className="text-center text-xs text-[#a0a0ff] italic">
          <p>Only top burners enter.</p>
          <p className="mt-2">Rankings update every 24h or whenever the swamp farts.</p>
        </div>
      </div>
    </div>
  );
}
