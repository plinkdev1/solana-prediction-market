import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { SludgeButton } from '@/components/sewer/sludge-button';
import { OddsBar } from '@/components/sewer/odds-bar';
import { TokenSelector } from '@/components/sewer/token-selector';

export const metadata = {
  title: 'Component Showcase - DXMarkets',
  description: 'Test all sewer components',
};

export default function TestComponentsPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <DrippingText as="h1" className="text-4xl mb-2" glowColor="pink">
            Component Showcase
          </DrippingText>
          <p className="text-[#a0a0ff]">Testing all sewer components</p>
        </div>

        {/* Dripping Text */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Dripping Text
          </h2>
          <div className="space-y-4">
            <DrippingText as="h1" className="text-4xl" glowColor="pink">
              Pink Neon Glow
            </DrippingText>
            <DrippingText as="h2" className="text-3xl" glowColor="cyan">
              Cyan Toxic Drip
            </DrippingText>
            <DrippingText as="h3" className="text-2xl" glowColor="orange" withDrip>
              Orange Sludge (with hover drip)
            </DrippingText>
          </div>
        </section>

        {/* Neon Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Neon Cards
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <NeonCard glowColor="pink" withDrip>
              <h3 className="text-lg font-bold text-[#ff00aa] mb-2">Pink Glow</h3>
              <p className="text-[#a0a0ff] text-sm">
                Default neon card with hot pink border glow and drip animation on hover.
              </p>
            </NeonCard>
            <NeonCard glowColor="cyan">
              <h3 className="text-lg font-bold text-[#00ffcc] mb-2">Cyan Glow</h3>
              <p className="text-[#a0a0ff] text-sm">
                Toxic cyan variant without drip animation.
              </p>
            </NeonCard>
            <NeonCard glowColor="orange" withDrip>
              <h3 className="text-lg font-bold text-[#ff6600] mb-2">Orange Glow</h3>
              <p className="text-[#a0a0ff] text-sm">
                Burnt orange sludge variant with drip.
              </p>
            </NeonCard>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Sludge Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <SludgeButton variant="primary">
              Primary Button
            </SludgeButton>
            <SludgeButton variant="secondary">
              Secondary Button
            </SludgeButton>
            <SludgeButton variant="ghost">
              Ghost Button
            </SludgeButton>
            <SludgeButton variant="primary" disabled>
              Disabled Button
            </SludgeButton>
            <SludgeButton variant="primary" withDrip={false}>
              No Drip Animation
            </SludgeButton>
          </div>
        </section>

        {/* Odds Bar */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Odds Bar
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-[#a0a0ff] text-sm mb-2">67% YES / 33% NO</p>
              <OddsBar yesPercentage={67} noPercentage={33} />
            </div>
            <div>
              <p className="text-[#a0a0ff] text-sm mb-2">23% YES / 77% NO</p>
              <OddsBar yesPercentage={23} noPercentage={77} />
            </div>
            <div>
              <p className="text-[#a0a0ff] text-sm mb-2">50% YES / 50% NO (Even split)</p>
              <OddsBar yesPercentage={50} noPercentage={50} />
            </div>
            <div>
              <p className="text-[#a0a0ff] text-sm mb-2">Without labels</p>
              <OddsBar yesPercentage={81} noPercentage={19} showLabels={false} />
            </div>
          </div>
        </section>

        {/* Token Selector */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Token Selector
          </h2>
          <div className="max-w-md">
            <p className="text-[#a0a0ff] text-sm mb-4">
              Multi-token selector for $DATX, SOL, and USDC
            </p>
            <TokenSelector 
              value="DATX" 
              onChange={(token) => console.log('[v0] Token selected:', token)} 
            />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Typography & Colors
          </h2>
          <div className="space-y-3">
            <p className="text-[#f0f0f0] text-lg">
              Primary text: #f0f0f0
            </p>
            <p className="text-[#a0a0ff]">
              Muted text: #a0a0ff
            </p>
            <p className="text-neon-pink text-xl">
              Neon pink with glow: #ff00aa
            </p>
            <p className="text-neon-cyan text-xl">
              Neon cyan with glow: #00ffcc
            </p>
            <p className="text-[#ff6600] text-xl">
              Sludge orange: #ff6600
            </p>
            <p className="font-[family-name:var(--font-display)] text-2xl text-[#ff00aa] uppercase">
              Bangers Display Font
            </p>
            <p className="font-sans text-lg text-[#f0f0f0]">
              Geist Sans Body Font
            </p>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] border-b border-[#ff00aa]/30 pb-2">
            Animations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#12001a] rounded-lg border border-[#ff00aa]/30">
              <h3 className="text-sm font-bold text-[#ff00aa] mb-4">Glow Pulse</h3>
              <div className="w-24 h-24 mx-auto bg-[#ff00aa] rounded-lg animate-glow-pulse" />
            </div>
            <div className="p-6 bg-[#12001a] rounded-lg border border-[#00ffcc]/30">
              <h3 className="text-sm font-bold text-[#00ffcc] mb-4">Sludge Drip</h3>
              <div className="relative h-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-b from-[#00ffcc] to-transparent animate-sludge-drip" />
              </div>
            </div>
            <div className="p-6 bg-[#12001a] rounded-lg border border-[#ff6600]/30">
              <h3 className="text-sm font-bold text-[#ff6600] mb-4">Spin</h3>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#ff00aa] to-[#00ffcc] animate-spin" 
                   style={{ 
                     maskImage: 'linear-gradient(transparent 40%, black 60%)',
                     WebkitMaskImage: 'linear-gradient(transparent 40%, black 60%)'
                   }} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
