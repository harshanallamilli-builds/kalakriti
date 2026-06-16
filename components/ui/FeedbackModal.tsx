// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { submitFeedback, type FeedbackState } from "@/lib/actions/feedback";

// const initial: FeedbackState = {};

// const CATEGORIES = [
//   { value: "suggestion", label: "Suggestion" },
//   { value: "bug", label: "Bug report" },
//   { value: "feature", label: "Feature idea" },
//   { value: "general", label: "General" },
// ];

// export function FeedbackModal() {
//   const [open, setOpen] = useState(false);
//   const [state, formAction, pending] = useActionState(submitFeedback, initial);

//   useEffect(() => {
//     if (state.success) {
//       const t = setTimeout(() => setOpen(false), 1800);
//       return () => clearTimeout(t);
//     }
//   }, [state.success]);

//   // Close on Escape
//   useEffect(() => {
//     if (!open) return;
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open]);

//   return (
//     <>
//       {/* Trigger — positioned above bottom nav on mobile */}
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="fixed bottom-[4.5rem] right-4 z-40 flex h-9 items-center gap-1.5 rounded-full border border-linen bg-cream/95 px-3 text-xs font-medium text-warm-gray shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all hover:border-clay hover:text-charcoal md:bottom-8 md:right-8 md:h-11 md:px-4 md:text-sm"
//         aria-label="Send feedback"
//       >
//         <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//         </svg>
//         <span className="hidden sm:inline">Feedback</span>
//       </button>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0">
//           <div
//             className="absolute inset-0 bg-espresso/25 backdrop-blur-sm"
//             onClick={() => setOpen(false)}
//           />
//           <div className="relative w-full max-w-sm animate-slide-up rounded-3xl border border-linen bg-cream p-6 shadow-[var(--shadow-lift)]">
//             <div className="flex items-center justify-between">
//               <h2 className="font-heading text-xl text-charcoal">Share feedback</h2>
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="flex h-8 w-8 items-center justify-center rounded-full text-warm-gray transition-colors hover:bg-sand"
//                 aria-label="Close"
//               >
//                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <p className="mt-1 text-sm text-warm-gray">
//               Suggestions, bugs, or just a note — we read everything.
//             </p>

//             {state.success ? (
//               <div className="mt-6 rounded-2xl bg-sage/15 px-4 py-6 text-center">
//                 <p className="font-heading text-2xl text-moss">Thank you ✦</p>
//                 <p className="mt-1 text-sm text-sage">Your feedback helps Kalakriti grow.</p>
//               </div>
//             ) : (
//               <form action={formAction} className="mt-5 space-y-4">
//                 {state.error && (
//                   <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
//                     {state.error}
//                   </p>
//                 )}

//                 <div className="flex flex-wrap gap-2">
//                   {CATEGORIES.map((cat) => (
//                     <label key={cat.value} className="cursor-pointer">
//                       <input
//                         type="radio"
//                         name="category"
//                         value={cat.value}
//                         className="sr-only peer"
//                         defaultChecked={cat.value === "general"}
//                       />
//                       <span className="inline-block rounded-full border border-linen px-3 py-1 text-xs font-medium text-warm-gray transition-all peer-checked:border-terracotta peer-checked:bg-terracotta/10 peer-checked:text-terracotta">
//                         {cat.label}
//                       </span>
//                     </label>
//                   ))}
//                 </div>

//                 <textarea
//                   name="message"
//                   rows={3}
//                   required
//                   minLength={5}
//                   placeholder="Tell us what's on your mind…"
//                   className="w-full resize-none rounded-2xl border border-linen bg-white px-4 py-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
//                 />

//                 <button
//                   type="submit"
//                   disabled={pending}
//                   className="w-full rounded-full bg-charcoal py-3 text-sm font-medium text-cream transition-all hover:bg-terracotta disabled:opacity-50"
//                 >
//                   {pending ? "Sending…" : "Send feedback"}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useActionState, useEffect, useState } from "react";
import { submitFeedback, type FeedbackState } from "@/lib/actions/feedback";

const initial: FeedbackState = {};

const CATEGORIES = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature idea" },
  { value: "general", label: "General" },
];

// This component only renders the modal panel + backdrop.
// The trigger button lives in the Navbar.
export function FeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitFeedback, initial);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => onClose(), 1800);
      return () => clearTimeout(t);
    }
  }, [state.success, onClose]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0">
      <div
        className="absolute inset-0 bg-espresso/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm animate-slide-up rounded-3xl border border-linen bg-cream p-6 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-charcoal">Share feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-warm-gray transition-colors hover:bg-sand"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-warm-gray">
          Suggestions, bugs, or just a note — we read everything.
        </p>

        {state.success ? (
          <div className="mt-6 rounded-2xl bg-sage/15 px-4 py-6 text-center">
            <p className="font-heading text-2xl text-moss">Thank you ✦</p>
            <p className="mt-1 text-sm text-sage">Your feedback helps Kalakriti grow.</p>
          </div>
        ) : (
          <form action={formAction} className="mt-5 space-y-4">
            {state.error && (
              <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
                {state.error}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    className="sr-only peer"
                    defaultChecked={cat.value === "general"}
                  />
                  <span className="inline-block rounded-full border border-linen px-3 py-1 text-xs font-medium text-warm-gray transition-all peer-checked:border-terracotta peer-checked:bg-terracotta/10 peer-checked:text-terracotta">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>

            <textarea
              name="message"
              rows={3}
              required
              minLength={5}
              placeholder="Tell us what's on your mind…"
              className="w-full resize-none rounded-2xl border border-linen bg-white px-4 py-3 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
            />

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-charcoal py-3 text-sm font-medium text-cream transition-all hover:bg-terracotta disabled:opacity-50"
            >
              {pending ? "Sending…" : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}