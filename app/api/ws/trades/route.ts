import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Server-Sent Events for real-time trade updates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketId = searchParams.get('market_id');

  console.log('[v0] WebSocket connection requested for market:', marketId);

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      console.log('[v0] SSE stream started');
      
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({ type: 'connected', marketId })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Subscribe to trades table changes using Supabase Realtime
      const channel = supabase
        .channel(`trades:${marketId || 'all'}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'trades',
            filter: marketId ? `market_id=eq.${marketId}` : undefined,
          },
          (payload) => {
            console.log('[v0] New trade detected:', payload.new);
            
            const message = `data: ${JSON.stringify({
              type: 'trade',
              data: payload.new,
            })}\n\n`;
            
            try {
              controller.enqueue(encoder.encode(message));
            } catch (error) {
              console.error('[v0] Error sending trade update:', error);
            }
          }
        )
        .subscribe();

      // Also send market updates
      const marketChannel = supabase
        .channel(`markets:${marketId || 'all'}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'markets',
            filter: marketId ? `id=eq.${marketId}` : undefined,
          },
          (payload) => {
            console.log('[v0] Market updated:', payload.new);
            
            const message = `data: ${JSON.stringify({
              type: 'market_update',
              data: payload.new,
            })}\n\n`;
            
            try {
              controller.enqueue(encoder.encode(message));
            } catch (error) {
              console.error('[v0] Error sending market update:', error);
            }
          }
        )
        .subscribe();

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        const heartbeat = `data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`;
        try {
          controller.enqueue(encoder.encode(heartbeat));
        } catch (error) {
          console.error('[v0] Heartbeat error:', error);
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        console.log('[v0] SSE connection closed');
        clearInterval(heartbeatInterval);
        supabase.removeChannel(channel);
        supabase.removeChannel(marketChannel);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
