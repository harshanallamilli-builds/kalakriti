"use client";

type MissingItem = {
  label: string;
  hint: string;
};

const MISSING_HINTS: Record<string, string> = {
  "Profile photo": "Add a photo so customers can put a face to your work.",
  "Banner image": "A banner makes your profile feel complete and professional.",
  "About Me": "Tell customers your story — where you're from, how you learned your craft.",
  "Craft category": "Help buyers find you by adding your craft speciality.",
  "City": "Buyers often want to know where their piece is coming from.",
  "Portfolio item": "Photos of your work are the best way to attract new customers.",
};

type Props = {
  percent: number;
  missing: string[];
};

export function ProfileCompleteness({ percent, missing }: Props) {
  const color =
    percent === 100
      ? "bg-sage"
      : percent >= 70
      ? "bg-saffron"
      : "bg-terracotta";

  const label =
    percent === 100
      ? "Profile complete ✨"
      : `${percent}% complete`;

  return (
    <div className="rounded-2xl border border-linen bg-white px-4 py-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-charcoal">Profile Completeness</p>
        <span className="text-sm font-semibold text-charcoal">{label}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-linen">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {missing.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <p className="text-xs font-medium text-charcoal/60 uppercase tracking-wide">
            A few things missing:
          </p>
          {missing.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron/60" />
              <div>
                <span className="text-xs font-medium text-charcoal">{item}</span>
                {MISSING_HINTS[item] && (
                  <span className="text-xs text-warm-gray"> — {MISSING_HINTS[item]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {percent === 100 && (
        <p className="mt-2 text-xs text-moss">
          Your profile looks great. Customers can find everything they need.
        </p>
      )}
    </div>
  );
}
