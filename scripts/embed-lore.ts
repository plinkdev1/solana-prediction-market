import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

async function embedText(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

async function processMarkdownFile(filePath: string) {
  console.log(`Processing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const chunks = chunkText(content, 500, 50);
  
  console.log(`  → Split into ${chunks.length} chunks`);
  
  let embedded = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      // Embed the chunk
      const embedding = await embedText(chunk);
      
      // Insert into Supabase
      const { error } = await supabase
        .from('lore_embeddings')
        .insert({
          content: chunk,
          embedding: embedding,
          metadata: {
            source: path.basename(filePath),
            chunk_index: i,
            total_chunks: chunks.length,
          },
        });
      
      if (error) {
        console.error(`  ✗ Failed to insert chunk ${i}:`, error);
      } else {
        embedded++;
        process.stdout.write(`\r  → Embedded ${embedded}/${chunks.length} chunks`);
      }
      
      // Rate limit: ~3 requests/second
      await new Promise(resolve => setTimeout(resolve, 350));
      
    } catch (error) {
      console.error(`\n  ✗ Error embedding chunk ${i}:`, error);
    }
  }
  
  console.log(`\n  ✓ Embedded ${embedded} chunks from ${filePath}`);
}

async function main() {
  console.log('=== DXMarkets Lore Embedding Script ===\n');
  
  // Check environment variables
  if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY not set');
    process.exit(1);
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Supabase credentials not set');
    process.exit(1);
  }
  
  // Find all .md files in /docs
  const docsDir = path.join(process.cwd(), 'docs');
  
  if (!fs.existsSync(docsDir)) {
    console.error(`Error: /docs directory not found at ${docsDir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(docsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(docsDir, f));
  
  console.log(`Found ${files.length} markdown files in /docs\n`);
  
  let totalEmbedded = 0;
  
  for (const file of files) {
    await processMarkdownFile(file);
    totalEmbedded++;
  }
  
  console.log(`\n=== Complete ===`);
  console.log(`Processed ${totalEmbedded} files`);
  
  // Verify insertions
  const { count } = await supabase
    .from('lore_embeddings')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total lore embeddings in database: ${count}`);
}

main().catch(console.error);
