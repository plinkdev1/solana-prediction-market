'use client';

export function SewerBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated drip effects */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 bg-gradient-to-b from-[#ff00aa] to-transparent animate-drip"
          style={{
            left: `${10 + i * 12}%`,
            height: '100vh',
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s',
            opacity: 0.15,
          }}
        />
      ))}
      
      {/* Sewer pipe dividers */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00aa]/20 to-transparent" />
      <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ffcc]/20 to-transparent" />
      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6600]/20 to-transparent" />
      
      {/* Radial gradient glow from center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff00aa]/5 rounded-full blur-[120px]" />
    </div>
  );
}
