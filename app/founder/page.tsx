"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── tiny hook: fires when element enters viewport ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Typewriter for the opening question ── */
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const { ref, visible } = useReveal(0.5);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [visible, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const tick = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(tick);
    }, 38);
    return () => clearInterval(tick);
  }, [started, text]);

  return (
    <span ref={ref} className="fp-typewriter">
      {displayed}
      {started && displayed.length < text.length && <span className="fp-cursor" />}
    </span>
  );
}

/* ── Reveal block ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`fp-reveal ${visible ? "fp-reveal--in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Pencil sketch SVG (ambient, decorative) ── */
function PencilSketch() {
  return (
    <svg className="fp-sketch" viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* rough face outline */}
      <ellipse cx="130" cy="130" rx="72" ry="86" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.55"/>
      {/* eyes */}
      <ellipse cx="108" cy="118" rx="9" ry="6" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="152" cy="118" rx="9" ry="6" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <circle cx="110" cy="119" r="3.5" fill="currentColor" opacity="0.35"/>
      <circle cx="154" cy="119" r="3.5" fill="currentColor" opacity="0.35"/>
      {/* nose */}
      <path d="M130 125 Q126 142 120 148 Q130 152 140 148 Q134 142 130 125Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      {/* mouth */}
      <path d="M118 164 Q130 172 142 164" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* hair rough strokes */}
      <path d="M60 115 Q65 55 130 44 Q195 55 200 115" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M62 110 Q70 60 130 48" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" fill="none" opacity="0.25"/>
      {/* neck + shoulders */}
      <path d="M118 215 Q108 230 60 260 Q55 270 58 280" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M142 215 Q152 230 200 260 Q205 270 202 280" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M118 215 L130 220 L142 215" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35"/>
      {/* construction lines — feel of in-progress sketch */}
      <line x1="90" y1="70" x2="90" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.18"/>
      <line x1="170" y1="70" x2="170" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.18"/>
      <line x1="70" y1="118" x2="190" y2="118" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.18"/>
      {/* pencil in bottom-right corner */}
      <g transform="translate(182,290) rotate(-35)">
        <rect x="0" y="0" width="8" height="44" rx="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
        <polygon points="0,44 8,44 4,54" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
        <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="0.8" opacity="0.35"/>
      </g>
    </svg>
  );
}

/* ══════════════════ MAIN PAGE ══════════════════ */
export default function FounderPage() {
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fp-root">

      {/* ── ambient background lines ── */}
      <div className="fp-bg-lines" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="fp-bg-line" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      {/* ══ HERO ══ */}
      <section className="fp-hero">
        <div className={`fp-hero__inner ${heroIn ? "fp-hero__inner--in" : ""}`}>

          {/* eyebrow */}
          <p className="fp-eyebrow">Meet the Founder</p>

          {/* Opening question — the heart of the story */}
          <h1 className="fp-hero__heading">
            How do creators<br />
            <em>reach the right people?</em>
          </h1>

          <p className="fp-hero__sub">
            That question started everything.
          </p>
        </div>

        {/* pencil sketch — ambient art reference */}
        <div className={`fp-sketch-wrap ${heroIn ? "fp-sketch-wrap--in" : ""}`}>
          <PencilSketch />
        </div>

        {/* scroll cue */}
        <div className="fp-scroll-cue" aria-hidden="true">
          <span className="fp-scroll-cue__line" />
          <span className="fp-scroll-cue__dot" />
        </div>
      </section>

      {/* ══ STORY BODY ══ */}
      <div className="fp-body">

        {/* ── section 1: before ── */}
        <section className="fp-section">
          <Reveal className="fp-section__label-wrap">
            <span className="fp-section__label">Before</span>
          </Reveal>

          <Reveal delay={80}>
            <p className="fp-intro">
              I'm <strong>Nallamilli Harsha Vardhan Reddy.</strong>
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="fp-body-text">
              Before this journey started, I was simply someone who loved creating art. I spent countless hours drawing pencil portraits — focusing on every small detail, trying to bring ideas to life on paper.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <blockquote className="fp-pullquote">
              "How do artists reach the right people and turn their work into something more?"
            </blockquote>
          </Reveal>

          <Reveal delay={100}>
            <p className="fp-body-text">
              That question stayed with me. It didn't leave.
            </p>
          </Reveal>
        </section>

        {/* ── horizontal rule ── */}
        <Reveal>
          <div className="fp-rule">
            <span />
            <span className="fp-rule__glyph">✦</span>
            <span />
          </div>
        </Reveal>

        {/* ── section 2: the observation ── */}
        <section className="fp-section">
          <Reveal className="fp-section__label-wrap">
            <span className="fp-section__label">The realization</span>
          </Reveal>

          <Reveal delay={80}>
            <p className="fp-body-text">
              As I spoke with artists and handmade creators, I noticed a pattern — a common challenge that almost everyone shared.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="fp-tension-card">
              <p className="fp-tension-card__text">
                Many talented people were creating amazing work.<br />
                But selling it online felt <em>complicated, overwhelming, or out of reach.</em>
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="fp-body-text">
              That realization became the starting point for <strong>Kalakriti.</strong>
            </p>
          </Reveal>
        </section>

        {/* ── section 3: what it is ── */}
        <Reveal>
          <div className="fp-rule">
            <span />
            <span className="fp-rule__glyph">✦</span>
            <span />
          </div>
        </Reveal>

        <section className="fp-section">
          <Reveal className="fp-section__label-wrap">
            <span className="fp-section__label">What it is</span>
          </Reveal>

          <Reveal delay={80}>
            <p className="fp-body-text">
              This platform wasn't created from a business plan alone. It grew from conversations, observations, and a genuine desire to make things simpler for creators who put their time, skill, and passion into their work.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="fp-mission">
              <p className="fp-mission__label">The goal</p>
              <p className="fp-mission__text">
                To build a creator-first platform where handmade artists and makers can showcase their work, connect with genuine buyers, and grow with confidence.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── section 4: the question that guides ── */}
        <Reveal>
          <div className="fp-rule">
            <span />
            <span className="fp-rule__glyph">✦</span>
            <span />
          </div>
        </Reveal>

        <section className="fp-section fp-section--dark">
          <Reveal>
            <p className="fp-section__label fp-section__label--light">One question guides every decision</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="fp-guiding-question">
              <Typewriter text="Does this genuinely help creators?" delay={300} />
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="fp-body-text fp-body-text--light">
              Every feature, every improvement, every choice — measured against this.
            </p>
          </Reveal>
        </section>

        {/* ── closing letter ── */}
        <section className="fp-letter">
          <Reveal>
            <p className="fp-letter__opener">We're still at the beginning.</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="fp-letter__body">
              But our direction is clear, and every person who joins — creator or buyer — makes the journey more real.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <p className="fp-letter__thanks">
              Thank you for being part of this.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <div className="fp-signature">
              <span className="fp-signature__name">— Harsha</span>
              <span className="fp-signature__title">Founder, Kalakriti</span>
            </div>
          </Reveal>
        </section>

        {/* ── CTA ── */}
        <Reveal>
          <div className="fp-cta">
            <Link href="/creators" className="fp-cta__btn fp-cta__btn--primary">
              Meet our creators
            </Link>
            <Link href="/marketplace" className="fp-cta__btn fp-cta__btn--ghost">
              Browse the marketplace
            </Link>
          </div>
        </Reveal>

      </div>
    </div>
  );
}