'use client';

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#ff00aa] mb-4">Debug Page</h1>
      <p className="text-[#f0f0f0]">If you can see this, routing works!</p>
      <div className="mt-4 space-y-2">
        <p className="text-[#a0a0ff]">Client-side rendering: ✓</p>
        <p className="text-[#a0a0ff]">Basic styles: ✓</p>
        <p className="text-[#a0a0ff]">Navigation accessible: ✓</p>
      </div>
    </div>
  );
}
