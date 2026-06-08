import { DrippingText } from '@/components/sewer/dripping-text';
import { NeonCard } from '@/components/sewer/neon-card';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimers - DXMarkets',
  description: 'Legal disclaimers and terms for DXMarkets - Sewer Bets on Solana',
};

export default function DisclaimersPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/bets"
          className="inline-block text-[#00ffcc] hover:text-[#ff00aa] transition-colors mb-4"
        >
          ← Back to Sewer
        </Link>

        <DrippingText as="h1" className="text-4xl md:text-5xl" glowColor="pink">
          Disclaimers & Terms
        </DrippingText>

        <NeonCard glowColor="pink" withDrip>
          <div className="prose prose-invert max-w-none space-y-6 text-[#f0f0f0]">
            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">Entertainment Only</h2>
              <p className="leading-relaxed">
                DXMarkets is a <strong>satirical prediction market</strong> for entertainment purposes. 
                This is <strong>NOT financial advice</strong>. Do not bet more than you can afford to lose. 
                All predictions are speculative and outcomes are uncertain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">No Gambling Guarantee</h2>
              <p className="leading-relaxed">
                We do not guarantee market liquidity, fair resolution, or protection against losses. 
                Markets are resolved by oracles and community consensus. Disputes may arise. 
                All transactions are final on the Solana blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">18+ Only</h2>
              <p className="leading-relaxed">
                You must be <strong>18 years or older</strong> to use this platform. By accessing 
                DXMarkets, you confirm you meet the age requirement in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">Risk Warning</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Smart contracts may contain bugs or vulnerabilities</li>
                <li>Token prices are volatile and unpredictable</li>
                <li>Blockchain transactions are irreversible</li>
                <li>Regulatory status is uncertain and may change</li>
                <li>You may lose all funds deposited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">Token Disclaimer</h2>
              <p className="leading-relaxed">
                $DATX is a utility token within the DatXit ecosystem. It has no intrinsic value, 
                no guaranteed liquidity, and no expectation of profit. It is not a security or 
                investment contract. Burn mechanics reduce supply but do not guarantee price appreciation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">Limitation of Liability</h2>
              <p className="leading-relaxed">
                DXMarkets is provided "as is" without warranties. We are not liable for losses, 
                technical failures, hacks, or any damages arising from your use of the platform. 
                Use at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#00ffcc] mb-3">Jurisdiction & Compliance</h2>
              <p className="leading-relaxed">
                This platform may not be available in all jurisdictions. It is your responsibility 
                to comply with local laws regarding prediction markets, gambling, and cryptocurrency. 
                We reserve the right to restrict access based on geographic location.
              </p>
            </section>

            <section className="pt-6 border-t border-[#ff00aa]/30">
              <p className="text-sm text-[#a0a0ff] italic">
                Last updated: February 2026. Everything is shit. No refunds.
              </p>
            </section>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
