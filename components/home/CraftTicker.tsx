// Infinite horizontal scrolling ticker — no JS needed, pure CSS animation
// Shows craft names in large Cormorant separated by hand-drawn ornament SVGs

const ITEMS = [
  "Pottery", "Brass Work", "Dhurrie Weaving", "Rosewood Carving",
  "Blue Pottery", "Dokra Casting", "Folk Paintings", "Silk Weaving",
  "Terracotta", "Bidri Craft", "Warli Art", "Pattachitra",
];

function Ornament() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0 opacity-30" aria-hidden="true">
      <circle cx="14" cy="14" r="3" fill="#b85c38" />
      <circle cx="14" cy="14" r="6" stroke="#b85c38" strokeWidth="1" fill="none" />
      <line x1="14" y1="2" x2="14" y2="8" stroke="#b85c38" strokeWidth="1.2" />
      <line x1="14" y1="20" x2="14" y2="26" stroke="#b85c38" strokeWidth="1.2" />
      <line x1="2" y1="14" x2="8" y2="14" stroke="#b85c38" strokeWidth="1.2" />
      <line x1="20" y1="14" x2="26" y2="14" stroke="#b85c38" strokeWidth="1.2" />
    </svg>
  );
}

export function CraftTicker() {
  // Duplicate for seamless loop
  const allItems = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-linen/60 bg-sand/15 py-4">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />

      <div className="ticker-track flex items-center gap-6 whitespace-nowrap">
        {allItems.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6">
            <span className="font-heading text-[1.5rem] font-medium italic text-charcoal/40 sm:text-[1.8rem]">
              {item}
            </span>
            <Ornament />
          </span>
        ))}
      </div>
    </div>
  );
}