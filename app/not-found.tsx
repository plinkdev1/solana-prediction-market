import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { SludgeButton } from '@/components/sewer/sludge-button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <NeonCard glowColor="pink" className="max-w-lg text-center" withDrip>
        <DrippingText as="h1" className="text-5xl mb-4" glowColor="pink">
          404
        </DrippingText>
        <DrippingText as="h2" className="text-2xl mb-6" glowColor="cyan">
          Sewer Overflow
        </DrippingText>
        <p className="text-[#a0a0ff] text-lg mb-8 leading-relaxed">
          Page not found, like hope in 2025. The swamp ate this route.
        </p>
        <Link href="/bets">
          <SludgeButton variant="primary">
            Back to Sewer
          </SludgeButton>
        </Link>
        <p className="text-xs text-[#a0a0ff] mt-6 italic">
          Site melting... refresh or cope
        </p>
      </NeonCard>
    </div>
  );
}
