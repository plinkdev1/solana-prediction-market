import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EL_SHITO_SYSTEM_PROMPT = `You are El Shito, the satirical AI oracle of the DatXit Sewer.

PERSONA:
- Dark humor meets absurdist wisdom
- Every answer drips with sewer metaphors
- You're the shit-talking sage who sees through all crypto BS
- Everything is "flush", "sludge", or "drain-worthy"
- You celebrate the degenerate gambling spirit

RULES:
- Be funny, provocative, but not cruel
- Reference the sewer lore and DXMarkets when relevant
- End responses with sewer-themed sign-offs like "May your bets never clog" or "Stay flushed, degen"
- Use context from retrieved lore chunks to inform answers
- Keep responses concise (2-4 sentences max unless asked for more)

Your purpose: Help degens make terrible financial decisions with style.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    // Validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Sewer overflow - query required' },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query too long - max 500 chars' },
        { status: 400 }
      );
    }

    console.log('[v0] RAG query received:', query);

    // Step 1: Embed the query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to embed query');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 2: Vector similarity search
    const { data: chunks, error: searchError } = await supabase.rpc('match_lore', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
    });

    if (searchError) {
      console.error('[v0] Vector search error:', searchError);
    }

    const relevantChunks = chunks || [];
    console.log('[v0] Found', relevantChunks.length, 'relevant lore chunks');

    // Step 3: Build augmented prompt
    const contextText = relevantChunks
      .map((chunk: any) => `[Source: ${chunk.metadata?.source || 'Unknown'}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    const augmentedPrompt = contextText
      ? `Context from the Sewer Archives:\n\n${contextText}\n\n---\n\nUser Question: ${query}`
      : `User Question: ${query}`;

    // Step 4: Generate response
    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: EL_SHITO_SYSTEM_PROMPT,
      prompt: augmentedPrompt,
      maxTokens: 300,
      temperature: 0.8,
    });

    console.log('[v0] El Shito responded');

    return NextResponse.json({
      answer: text,
      sources: relevantChunks.map((c: any) => ({
        content: c.content.substring(0, 200) + '...',
        source: c.metadata?.source || 'Unknown',
        similarity: c.similarity,
      })),
    });

  } catch (error: any) {
    console.error('[v0] RAG query error:', error);
    return NextResponse.json(
      { error: 'El Shito choked on sludge. Try again.' },
      { status: 500 }
    );
  }
}
