// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { completeCreatorSetup } from "@/lib/actions/auth";
// import { Input } from "@/components/ui/Input";
// import { Textarea } from "@/components/ui/Textarea";
// import { Select } from "@/components/ui/Select";
// import { Button } from "@/components/ui/Button";
// import { PRODUCT_CATEGORIES } from "@/lib/types";

// /**
//  * Shown after first Google login for creators who don't have store_name/craft set.
//  * Blocks dashboard access until setup is complete.
//  */
// export function CreatorSetupDialog() {
//   const router = useRouter();
//   const [error, setError] = useState("");
//   const [isPending, startTransition] = useTransition();

//   const craftOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");
//     const formData = new FormData(e.currentTarget);

//     startTransition(async () => {
//       const result = await completeCreatorSetup(formData);
//       if (result.error) {
//         setError(result.error);
//       } else {
//         router.refresh();
//       }
//     });
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4">
//       <div className="w-full max-w-lg rounded-3xl border border-linen bg-cream shadow-[var(--shadow-lift)] p-8">
//         {/* Header */}
//         <div className="text-center mb-7">
//           <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-2xl text-cream shadow-[var(--shadow-card)] mx-auto">
//             K
//           </span>
//           <h2 className="mt-4 font-heading text-2xl text-charcoal">
//             Set up your studio
//           </h2>
//           <p className="mt-2 text-sm text-warm-gray leading-relaxed">
//             Tell buyers a little about you and your craft. This takes just a minute.
//           </p>
//         </div>

//         {error && (
//           <p className="mb-4 rounded-2xl bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Store name"
//             name="store_name"
//             required
//             placeholder="e.g. Mati by Priya"
//           />
//           <Select
//             label="Craft category"
//             name="craft"
//             options={craftOptions}
//             required
//           />
//           <Input
//             label="City"
//             name="city"
//             required
//             placeholder="e.g. Jaipur"
//           />
//           <Textarea
//             label="Bio (optional)"
//             name="bio"
//             placeholder="Tell buyers about your craft journey, inspiration, or process…"
//           />

//           <Button
//             type="submit"
//             variant="secondary"
//             className="w-full mt-2"
//             disabled={isPending}
//           >
//             {isPending ? "Saving…" : "Complete setup →"}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeCreatorSetup } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LinksEditor } from "@/components/creators/LinksEditor";
import { PRODUCT_CATEGORIES } from "@/lib/types";

/**
 * Shown after first Google login for creators who don't have store_name/craft set.
 * Blocks dashboard access until setup is complete.
 */
export function CreatorSetupDialog() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const craftOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await completeCreatorSetup(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-3xl border border-linen bg-cream shadow-[var(--shadow-lift)] p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-7">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-2xl text-cream shadow-[var(--shadow-card)] mx-auto">
            K
          </span>
          <h2 className="mt-4 font-heading text-2xl text-charcoal">
            Set up your studio
          </h2>
          <p className="mt-2 text-sm text-warm-gray leading-relaxed">
            Tell buyers a little about you and your craft. This takes just a minute.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-2xl bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Store name"
            name="store_name"
            required
            placeholder="e.g. Mati by Priya"
          />
          <Select
            label="Craft category"
            name="craft"
            options={craftOptions}
            required
          />
          <Input
            label="City"
            name="city"
            required
            placeholder="e.g. Jaipur"
          />
          <Textarea
            label="Bio (optional)"
            name="bio"
            placeholder="Tell buyers about your craft journey, inspiration, or process…"
          />

          {/* Social links — all optional, shown to buyers once admin activates each type */}
          <div className="rounded-2xl border border-linen bg-sand/20 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-saffron mb-1">
              Your links <span className="normal-case text-warm-gray font-normal">(optional)</span>
            </p>
            <p className="text-xs text-warm-gray mb-3">
              Add Instagram, WhatsApp, website etc. You can skip this and add/edit anytime from your studio page.
            </p>
            <LinksEditor fieldName="links" />
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full mt-2"
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Complete setup →"}
          </Button>
        </form>
      </div>
    </div>
  );
}