import { useMicrocopy } from '@/hooks/use-microcopy';
import { NeonCard } from '@/components/sewer/neon-card';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <NeonCard glowColor="pink" className="text-center max-w-md">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#ff00aa] to-[#00ffcc] animate-spin" 
               style={{ 
                 maskImage: 'linear-gradient(transparent 40%, black 60%)',
                 WebkitMaskImage: 'linear-gradient(transparent 40%, black 60%)'
               }} 
          />
          <p className="text-[#a0a0ff] text-lg italic">
            Flushing the cache...
          </p>
        </div>
      </NeonCard>
    </div>
  );
}
