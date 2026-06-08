'use client';

import { useState } from 'react';
import { NeonCard } from '@/components/sewer/neon-card';
import { SludgeButton } from '@/components/sewer/sludge-button';
import { DrippingText } from '@/components/sewer/dripping-text';

export default function APITestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (name: string, url: string, options?: RequestInit) => {
    setLoading(name);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          ok: response.ok,
          data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DrippingText className="text-4xl text-center mb-8">
        API Testing Console
      </DrippingText>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {/* Markets API Tests */}
        <NeonCard glowColor="pink">
          <h2 className="text-2xl font-bold text-[#ff00aa] mb-4">Markets API</h2>
          <div className="space-y-2">
            <SludgeButton
              onClick={() => runTest('markets-list', '/api/markets')}
              disabled={loading === 'markets-list'}
              className="w-full"
            >
              {loading === 'markets-list' ? 'Testing...' : 'GET /api/markets'}
            </SludgeButton>

            <SludgeButton
              onClick={() => runTest('markets-detail', '/api/markets/market-1')}
              disabled={loading === 'markets-detail'}
              className="w-full"
              variant="secondary"
            >
              {loading === 'markets-detail' ? 'Testing...' : 'GET /api/markets/market-1'}
            </SludgeButton>

            <SludgeButton
              onClick={() => runTest('markets-filter', '/api/markets?category=crypto&status=active')}
              disabled={loading === 'markets-filter'}
              className="w-full"
              variant="secondary"
            >
              {loading === 'markets-filter' ? 'Testing...' : 'GET /api/markets?category=crypto'}
            </SludgeButton>
          </div>

          {results['markets-list'] && (
            <div className="mt-4 p-4 bg-[#12001a] rounded-lg">
              <pre className="text-xs text-[#00ffcc] overflow-x-auto">
                {JSON.stringify(results['markets-list'], null, 2)}
              </pre>
            </div>
          )}
        </NeonCard>

        {/* Trades API Tests */}
        <NeonCard glowColor="cyan">
          <h2 className="text-2xl font-bold text-[#00ffcc] mb-4">Trades API</h2>
          <div className="space-y-2">
            <SludgeButton
              onClick={() => runTest('trades-list', '/api/trades?market_id=market-1&limit=10')}
              disabled={loading === 'trades-list'}
              className="w-full"
            >
              {loading === 'trades-list' ? 'Testing...' : 'GET /api/trades?market_id=market-1'}
            </SludgeButton>

            <SludgeButton
              onClick={() => runTest('trades-post', '/api/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: 'test-user-1',
                  market_id: 'market-1',
                  outcome: 'yes',
                  amount: 100,
                  token_type: 'DATX',
                  trade_type: 'buy',
                }),
              })}
              disabled={loading === 'trades-post'}
              className="w-full"
              variant="secondary"
            >
              {loading === 'trades-post' ? 'Testing...' : 'POST /api/trades (Mock Trade)'}
            </SludgeButton>
          </div>

          {results['trades-list'] && (
            <div className="mt-4 p-4 bg-[#12001a] rounded-lg">
              <pre className="text-xs text-[#00ffcc] overflow-x-auto">
                {JSON.stringify(results['trades-list'], null, 2)}
              </pre>
            </div>
          )}
        </NeonCard>

        {/* Positions API Tests */}
        <NeonCard glowColor="orange">
          <h2 className="text-2xl font-bold text-[#ff6600] mb-4">Positions API</h2>
          <div className="space-y-2">
            <SludgeButton
              onClick={() => runTest('positions-list', '/api/positions?user_id=test-user-1')}
              disabled={loading === 'positions-list'}
              className="w-full"
            >
              {loading === 'positions-list' ? 'Testing...' : 'GET /api/positions?user_id=test-user-1'}
            </SludgeButton>
          </div>

          {results['positions-list'] && (
            <div className="mt-4 p-4 bg-[#12001a] rounded-lg">
              <pre className="text-xs text-[#00ffcc] overflow-x-auto">
                {JSON.stringify(results['positions-list'], null, 2)}
              </pre>
            </div>
          )}
        </NeonCard>

        {/* Admin API Tests */}
        <NeonCard glowColor="pink">
          <h2 className="text-2xl font-bold text-[#ff00aa] mb-4">Admin API</h2>
          <div className="space-y-2">
            <SludgeButton
              onClick={() => runTest('setup-db', '/api/admin/setup-db', { method: 'POST' })}
              disabled={loading === 'setup-db'}
              className="w-full"
            >
              {loading === 'setup-db' ? 'Testing...' : 'POST /api/admin/setup-db (Seed Data)'}
            </SludgeButton>
          </div>

          {results['setup-db'] && (
            <div className="mt-4 p-4 bg-[#12001a] rounded-lg">
              <pre className="text-xs text-[#00ffcc] overflow-x-auto">
                {JSON.stringify(results['setup-db'], null, 2)}
              </pre>
            </div>
          )}
        </NeonCard>

        {/* Test All */}
        <SludgeButton
          onClick={async () => {
            await runTest('markets-list', '/api/markets');
            await runTest('markets-detail', '/api/markets/market-1');
            await runTest('trades-list', '/api/trades?market_id=market-1&limit=10');
            await runTest('positions-list', '/api/positions?user_id=test-user-1');
          }}
          className="w-full"
          variant="primary"
        >
          Run All Tests
        </SludgeButton>
      </div>

      {/* Summary */}
      <div className="mt-8 max-w-4xl mx-auto">
        <NeonCard glowColor="cyan">
          <h3 className="text-xl font-bold text-[#00ffcc] mb-4">Test Summary</h3>
          <div className="space-y-2">
            {Object.entries(results).map(([name, result]) => (
              <div key={name} className="flex items-center justify-between p-2 bg-[#12001a] rounded">
                <span className="text-sm font-mono text-[#a0a0ff]">{name}</span>
                <span className={`text-sm font-bold ${result.ok ? 'text-[#00ffcc]' : 'text-[#ff00aa]'}`}>
                  {result.ok ? '✓ PASS' : result.error ? '✗ ERROR' : '✗ FAIL'}
                </span>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
