import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import { SludgeButton } from '@/components/sewer/sludge-button';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - DXMarkets',
  description: 'GDPR-compliant privacy policy for DXMarkets - Sewer Bets on Solana',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/bets"
          className="inline-block text-[#00ffcc] hover:text-[#ff00aa] transition-colors mb-4"
        >
          ← Back to Sewer
        </Link>

        <DrippingText as="h1" className="text-4xl md:text-5xl" glowColor="cyan">
          Privacy Policy
        </DrippingText>

        <NeonCard glowColor="cyan">
          <div className="prose prose-invert max-w-none space-y-6 text-[#f0f0f0]">
            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">What We Collect</h2>
              <p className="leading-relaxed">
                We collect wallet addresses, transaction data, consent logs (age gate, cookies), 
                and basic analytics (page views, interactions). No personal identifying information 
                is collected unless you voluntarily provide it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">How We Use It</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process bets and market transactions on Solana blockchain</li>
                <li>To display leaderboards and user positions</li>
                <li>To comply with age verification and GDPR requirements</li>
                <li>To improve site performance and user experience</li>
                <li>To prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">Your Rights (GDPR)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">Cookies</h2>
              <p className="leading-relaxed">
                We use cookies for essential functionality (wallet connection persistence, 
                consent tracking) and analytics. You can decline cookies via the banner, 
                but some features may not work properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">Data Retention</h2>
              <p className="leading-relaxed">
                On-chain data (bets, transactions) is permanent and cannot be deleted. 
                Off-chain data (consent logs, profiles) is retained for 2 years or until 
                you request deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#ff00aa] mb-3">Contact</h2>
              <p className="leading-relaxed">
                For data requests or privacy concerns, contact:{' '}
                <a href="mailto:privacy@datxit.space" className="text-[#00ffcc] hover:underline">
                  privacy@datxit.space
                </a>
              </p>
            </section>
          </div>
        </NeonCard>

        <NeonCard glowColor="orange" className="bg-[#12001a]">
          <h3 className="text-xl font-bold text-[#ff6600] mb-4">Exercise Your Rights</h3>
          <div className="flex gap-4 flex-wrap">
            <SludgeButton disabled variant="secondary">
              Export My Data
            </SludgeButton>
            <SludgeButton disabled variant="ghost">
              Delete My Account
            </SludgeButton>
          </div>
          <p className="text-xs text-[#a0a0ff] mt-4 italic">
            Coming Soon - Full GDPR compliance tools in development
          </p>
        </NeonCard>
      </div>
    </div>
  );
}
