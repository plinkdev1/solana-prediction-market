import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MARKET_GENERATION_PROMPT = `You are El Shito, the market generator of DXMarkets Sewer Bets.

Generate a satirical, provocative prediction market that fits the DatXit sewer lore.

Requirements:
- Title: Max 100 characters, question format ending in "?"
- Description: Max 300 characters, satirical and engaging
- Must be something degens would actually bet on
- Dark humor is encouraged, but no hate speech
- Reference crypto/politics/tech/entertainment trends
- Include sewer metaphors when appropriate

Return ONLY valid JSON in this exact format:
{
  "title": "Your market title here?",
  "description": "Your satirical description here"
}

DO NOT include any text before or after the JSON. Only return the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { topic, category } = body;

    console.log('[v0] Generate market request:', { topic, category });

    // Build prompt
    let userPrompt = 'Generate a random prediction market';
    if (topic) {
      userPrompt = `Generate a prediction market about: ${topic}`;
    }
    if (category) {
      userPrompt += ` (category: ${category})`;
    }

    // Optional: Fetch relevant lore for context
    let contextText = '';
    if (topic) {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: topic,
        }),
      });

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;

        const { data: chunks } = await supabase.rpc('match_lore', {
          query_embedding: queryEmbedding,
          match_threshold: 0.6,
          match_count: 2,
        });

        if (chunks && chunks.length > 0) {
          contextText = `Relevant lore:\n${chunks.map((c: any) => c.content).join('\n')}\n\n`;
        }
      }
    }

    const augmentedPrompt = contextText + userPrompt;

    // Generate market
    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: MARKET_GENERATION_PROMPT,
      prompt: augmentedPrompt,
      maxTokens: 200,
      temperature: 0.9,
    });

    console.log('[v0] Generated market text:', text);

    // Parse JSON response
    try {
      const parsed = JSON.parse(text.trim());
      
      if (!parsed.title || !parsed.description) {
        throw new Error('Missing title or description');
      }

      // Validate lengths
      if (parsed.title.length > 100) {
        parsed.title = parsed.title.substring(0, 97) + '...';
      }
      if (parsed.description.length > 300) {
        parsed.description = parsed.description.substring(0, 297) + '...';
      }

      console.log('[v0] Market generated successfully');

      return NextResponse.json({
        title: parsed.title,
        description: parsed.description,
        category: category || 'crypto',
      });

    } catch (parseError) {
      console.error('[v0] Failed to parse AI response:', text);
      
      // Fallback to hardcoded market
      return NextResponse.json({
        title: 'Will this market break the sewer pipes?',
        description: 'El Shito is having technical difficulties. But hey, bet on whether AI can actually generate coherent markets.',
        category: category || 'crypto',
      });
    }

  } catch (error: any) {
    console.error('[v0] Generate market error:', error);
    return NextResponse.json(
      { error: 'El Shito is clogged. Try flushing again.' },
      { status: 500 }
    );
  }
}
