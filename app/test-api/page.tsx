'use client';

import { useState } from 'react';
import { DXMarketsAPI } from '@/lib/api-client';
import { NeonCard } from '@/components/sewer/neon-card';
import { SludgeButton } from '@/components/sewer/sludge-button';
import { Check, X, Loader2 } from 'lucide-react';

export default function TestAPIPage() {
  const [results, setResults] = useState<Record<string, { status: 'idle' | 'loading' | 'success' | 'error'; data?: any; error?: string }>>({});

  const runTest = async (name: string, fn: () => Promise<any>) => {
    setResults(prev => ({ ...prev, [name]: { status: 'loading' } }));
    try {
      const data = await fn();
      setResults(prev => ({ ...prev, [name]: { status: 'success', data } }));
    } catch (error: any) {
      setResults(prev => ({ ...prev, [name]: { status: 'error', error: error.message } }));
    }
  };

  const tests = [
    {
      name: 'Get All Markets',
      fn: () => DXMarketsAPI.getMarkets(),
      description: 'Fetch all markets from Supabase'
    },
    {
      name: 'Get Markets (Crypto)',
      fn: () => DXMarketsAPI.getMarkets({ category: 'crypto' }),
      description: 'Filter markets by crypto category'
    },
    {
      name: 'Get Single Market',
      fn: () => DXMarketsAPI.getMarket('44444444-4444-4444-4444-444444444444'),
      description: 'Fetch specific market by ID'
    },
    {
      name: 'Get All Positions',
      fn: () => DXMarketsAPI.getPositions(),
      description: 'Fetch all user positions'
    },
    {
      name: 'Get User Positions',
      fn: () => DXMarketsAPI.getPositions('11111111-1111-1111-1111-111111111111'),
      description: 'Fetch positions for specific user'
    },
    {
      name: 'Get All Trades',
      fn: () => DXMarketsAPI.getTrades(),
      description: 'Fetch recent trades (limit 50)'
    },
    {
      name: 'Get Market Trades',
      fn: () => DXMarketsAPI.getTrades('44444444-4444-4444-4444-444444444444'),
      description: 'Fetch trades for specific market'
    },
    {
      name: 'Get Treasury',
      fn: () => DXMarketsAPI.getTreasury(),
      description: 'Fetch treasury stats (volume, rake, burns)'
    },
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.fn);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neon-pink">
            DXMarkets API Test Suite
          </h1>
          <p className="text-lg text-[#a0a0ff]">
            Test all REST API endpoints against live Supabase database
          </p>
          <div className="flex gap-4 justify-center">
            <SludgeButton onClick={runAllTests} variant="primary">
              Run All Tests
            </SludgeButton>
          </div>
        </div>

        <div className="grid gap-6">
          {tests.map((test) => {
            const result = results[test.name];
            const status = result?.status || 'idle';

            return (
              <NeonCard key={test.name} glowColor={
                status === 'success' ? 'cyan' : 
                status === 'error' ? 'pink' : 
                'orange'
              }>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#f0f0f0]">{test.name}</h3>
                      <p className="text-sm text-[#a0a0ff]">{test.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'loading' && (
                        <Loader2 className="w-5 h-5 text-[#ff6600] animate-spin" />
                      )}
                      {status === 'success' && (
                        <Check className="w-5 h-5 text-[#00ffcc]" />
                      )}
                      {status === 'error' && (
                        <X className="w-5 h-5 text-[#ff00aa]" />
                      )}
                      <SludgeButton
                        onClick={() => runTest(test.name, test.fn)}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                        disabled={status === 'loading'}
                      >
                        Test
                      </SludgeButton>
                    </div>
                  </div>

                  {result && (
                    <div className="mt-4">
                      {status === 'success' && (
                        <div className="space-y-2">
                          <div className="text-xs text-[#00ffcc] font-mono">
                            ✓ Success - Received {Array.isArray(result.data) ? result.data.length : '1'} record(s)
                          </div>
                          <details className="text-xs">
                            <summary className="text-[#a0a0ff] cursor-pointer hover:text-[#ff00aa]">
                              View Response Data
                            </summary>
                            <pre className="mt-2 p-3 bg-[#0a0012] rounded border border-[#ff00aa]/20 overflow-x-auto text-[#f0f0f0]">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                      {status === 'error' && (
                        <div className="text-xs text-[#ff00aa] font-mono">
                          ✗ Error: {result.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </NeonCard>
            );
          })}
        </div>

        {/* Summary */}
        <NeonCard glowColor="pink" className="text-center">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#ff00aa]">Test Summary</h3>
            <div className="flex gap-6 justify-center text-sm">
              <div>
                <span className="text-[#00ffcc]">✓ Passed: </span>
                <span className="text-[#f0f0f0] font-bold">
                  {Object.values(results).filter(r => r.status === 'success').length}
                </span>
              </div>
              <div>
                <span className="text-[#ff00aa]">✗ Failed: </span>
                <span className="text-[#f0f0f0] font-bold">
                  {Object.values(results).filter(r => r.status === 'error').length}
                </span>
              </div>
              <div>
                <span className="text-[#a0a0ff]">Total: </span>
                <span className="text-[#f0f0f0] font-bold">
                  {tests.length}
                </span>
              </div>
            </div>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
