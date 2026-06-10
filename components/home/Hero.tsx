import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Box className="grain-overlay pointer-events-none absolute inset-0 opacity-50" />
      <Box className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20 lg:px-8 lg:py-24">
        <Box className="animate-fade-up order-2 md:order-1">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-saffron">
            Handmade India · Made by hand
          </p>
          <h1 className="font-heading text-4xl font-medium leading-[1.08] text-charcoal md:text-5xl lg:text-[3.25rem]">
            Where every piece
            <span className="block text-terracotta">carries a story</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-warm-gray md:text-lg">
            Kalakriti connects you with independent Indian artisans — pottery,
            weaving, woodwork, metal craft — shared straight from studio to home.
          </p>
          <Box className="mt-8 flex flex-wrap gap-3">
            <Button href="/marketplace" size="lg">
              Explore marketplace
            </Button>
            <Button href="/auth/signup?role=creator" size="lg" variant="outline">
              Open your studio
            </Button>
          </Box>
          <p className="mt-8 text-sm text-warm-gray">
            Browse freely as a guest &middot;{" "}
            <Link href="/auth/signup?role=user" className="text-terracotta hover:text-charcoal">
              Sign up
            </Link>{" "}
            to message artisans &amp; place orders
          </p>
        </Box>

        {/* Craft mosaic visual */}
        <Box className="animate-fade-up animation-delay-150 relative order-1 md:order-2">
          <Box className="relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)]" style={{aspectRatio:"4/5",background:"linear-gradient(135deg,#f0e8dc,#e5d9c8,#c49a6c22)"}}>
            {/* Mosaic grid */}
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-5">
              {/* Pottery — tall left cell */}
              <div className="relative row-span-2 overflow-hidden rounded-2xl flex flex-col items-center justify-center" style={{background:"rgba(184,92,56,0.10)"}}>
                <svg viewBox="0 0 120 160" className="w-3/4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="60" cy="142" rx="34" ry="7" fill="#c49a6c" opacity="0.35"/>
                  <path d="M33 82 Q25 104 31 130 Q41 148 60 148 Q79 148 89 130 Q95 104 87 82Z" fill="#b85c38" opacity="0.65"/>
                  <path d="M41 82 Q37 62 43 42 Q51 22 60 20 Q69 22 77 42 Q83 62 79 82Z" fill="#d4920a" opacity="0.45"/>
                  <path d="M45 40 Q53 30 60 28 Q67 30 75 40" stroke="#faf6f0" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <ellipse cx="60" cy="82" rx="26" ry="5" fill="#3a322c" opacity="0.12"/>
                  <path d="M39 96 Q52 91 60 92 Q68 91 81 96" stroke="#faf6f0" strokeWidth="1" fill="none" opacity="0.4"/>
                  <path d="M35 112 Q48 107 60 108 Q72 107 85 112" stroke="#faf6f0" strokeWidth="1" fill="none" opacity="0.3"/>
                </svg>
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest font-medium" style={{color:"rgba(184,92,56,0.6)"}}>Pottery</span>
              </div>

              {/* Textile top-right */}
              <div className="relative overflow-hidden rounded-2xl flex items-center justify-center" style={{background:"rgba(212,146,10,0.08)"}}>
                <svg viewBox="0 0 100 80" className="w-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {[0,1,2,3,4,5,6].map(i => (
                    <line key={i} x1={i*16+8} y1="0" x2={i*16+8} y2="80" stroke="#d4920a" strokeWidth="2" opacity="0.35"/>
                  ))}
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <line key={i} x1="0" y1={i*11+4} x2="100" y2={i*11+4} stroke="#b85c38" strokeWidth={i%2===0?2:1} opacity={i%2===0?0.45:0.2}/>
                  ))}
                  <rect x="22" y="22" width="56" height="36" rx="3" fill="#d4920a" opacity="0.12"/>
                </svg>
                <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest font-medium" style={{color:"rgba(212,146,10,0.6)"}}>Textiles</span>
              </div>

              {/* Metal bottom-right */}
              <div className="relative overflow-hidden rounded-2xl flex items-center justify-center" style={{background:"rgba(107,143,113,0.08)"}}>
                <svg viewBox="0 0 100 80" className="w-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="40" r="26" stroke="#6b8f71" strokeWidth="2.5" opacity="0.45"/>
                  <circle cx="50" cy="40" r="18" stroke="#6b8f71" strokeWidth="1.5" opacity="0.35"/>
                  <circle cx="50" cy="40" r="10" fill="#6b8f71" opacity="0.18"/>
                  {[0,45,90,135,180,225,270,315].map((a,i) => (
                    <line key={i}
                      x1={50+18*Math.cos(a*Math.PI/180)}
                      y1={40+18*Math.sin(a*Math.PI/180)}
                      x2={50+26*Math.cos(a*Math.PI/180)}
                      y2={40+26*Math.sin(a*Math.PI/180)}
                      stroke="#6b8f71" strokeWidth="2" opacity="0.45"/>
                  ))}
                  <circle cx="50" cy="40" r="3.5" fill="#4a6b52" opacity="0.55"/>
                </svg>
                <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest font-medium" style={{color:"rgba(107,143,113,0.6)"}}>Metal work</span>
              </div>
            </div>

            {/* Bottom info card */}
            <Box className="absolute bottom-4 left-4 right-4 rounded-2xl bg-cream/95 p-4 backdrop-blur-sm shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-widest text-saffron">Artisan-first</p>
              <p className="mt-1 font-heading text-lg text-charcoal">Direct conversations. No middlemen.</p>
            </Box>
          </Box>

          {/* Floating INR badge */}
          <div className="absolute -right-4 top-10 hidden rounded-2xl border border-linen bg-cream px-4 py-3 shadow-[var(--shadow-card)] md:block">
            <p className="text-xs text-warm-gray">Priced in</p>
            <p className="font-heading text-xl text-terracotta">₹ INR</p>
          </div>
        </Box>
      </Box>
    </section>
  );
}
