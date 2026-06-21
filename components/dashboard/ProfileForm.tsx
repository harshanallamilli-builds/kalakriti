// "use client";

// import Image from "next/image";
// import { useActionState, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { updateProfile, type AuthState } from "@/lib/actions/auth";
// import { addToast } from "@/lib/hooks/useToast";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
// import { Textarea } from "@/components/ui/Textarea";
// import { INDIAN_STATES, type Profile } from "@/lib/types";
// import { getInitials, formatLocation } from "@/lib/utils";

// const initial: AuthState = {};

// export function ProfileForm({ profile }: { profile: Profile }) {
//   const router = useRouter();
//   const [state, formAction, pending] = useActionState(updateProfile, initial);
//   const [editing, setEditing] = useState(false);
//   const isCreator = profile.role === "creator";

//   useEffect(() => {
//     if (state.success) {
//       setEditing(false);
//       addToast("Profile saved", "success");
//       router.refresh();
//     }
//   }, [state.success, router]);

//   const location = formatLocation(profile.city, profile.state);

//   // ── View mode ────────────────────────────────────────────
//   if (!editing) {
//     return (
//       <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]">
//         <div className="flex items-start justify-between gap-4">
//           <h2 className="font-heading text-xl text-charcoal">
//             {isCreator ? "Studio Profile" : "Profile"}
//           </h2>
//           <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
//             Edit
//           </Button>
//         </div>

//         <div className="mt-5 flex items-center gap-4">
//           <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-linen">
//             {profile.avatar_url ? (
//               <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
//             ) : (
//               <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-xl text-terracotta">
//                 {getInitials(profile.full_name)}
//               </span>
//             )}
//           </div>
//           <div>
//             <p className="font-medium text-charcoal">{profile.full_name}</p>
//             {isCreator && profile.craft && (
//               <p className="text-sm text-warm-gray">{profile.craft}</p>
//             )}
//             {location && <p className="text-sm text-warm-gray">{location}</p>}
//           </div>
//         </div>

//         {isCreator && (
//           <div className="mt-5 space-y-2 text-sm">
//             {profile.store_name && (
//               <div className="flex gap-2">
//                 <span className="w-28 shrink-0 text-warm-gray">Studio</span>
//                 <span className="text-charcoal">{profile.store_name}</span>
//               </div>
//             )}
//             {profile.whatsapp && (
//               <div className="flex gap-2">
//                 <span className="w-28 shrink-0 text-warm-gray">WhatsApp</span>
//                 <span className="text-charcoal">+{profile.whatsapp}</span>
//               </div>
//             )}
//             {profile.years_experience && (
//               <div className="flex gap-2">
//                 <span className="w-28 shrink-0 text-warm-gray">Experience</span>
//                 <span className="text-charcoal">{profile.years_experience} years</span>
//               </div>
//             )}
//             {profile.bio && (
//               <div className="mt-3 rounded-2xl bg-sand/30 p-3 text-sm leading-relaxed text-charcoal/80">
//                 {profile.bio}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ── Edit mode ────────────────────────────────────────────
//   return (
//     <form
//       action={formAction}
//       className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]"
//     >
//       <div className="flex items-center justify-between gap-4">
//         <h2 className="font-heading text-xl text-charcoal">
//           {isCreator ? "Edit Studio Profile" : "Edit Profile"}
//         </h2>
//         <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
//           Cancel
//         </Button>
//       </div>

//       {state.error && (
//         <p className="mt-3 rounded-2xl bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
//           {state.error}
//         </p>
//       )}

//       {/* Avatar */}
//       <div className="mt-5 flex items-center gap-4">
//         <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-linen">
//           {profile.avatar_url ? (
//             <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
//           ) : (
//             <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-xl text-terracotta">
//               {getInitials(profile.full_name)}
//             </span>
//           )}
//         </div>
//         <div className="flex-1">
//           <p className="text-sm font-medium text-charcoal/80">Profile photo</p>
//           <input
//             type="file"
//             name="avatar"
//             accept="image/*"
//             className="mt-1 block w-full cursor-pointer rounded-xl border border-dashed border-linen bg-sand/30 px-3 py-2 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-xs file:text-cream"
//           />
//         </div>
//       </div>

//       {/* Banner (creators only) */}
//       {isCreator && (
//         <div className="mt-4">
//           <p className="text-sm font-medium text-charcoal/80">Banner image</p>
//           {profile.banner_url && (
//             <div className="relative mt-1 h-20 w-full overflow-hidden rounded-xl border border-linen">
//               <Image src={profile.banner_url} alt="Current banner" fill className="object-cover" />
//             </div>
//           )}
//           <input
//             type="file"
//             name="banner"
//             accept="image/*"
//             className="mt-1 block w-full cursor-pointer rounded-xl border border-dashed border-linen bg-sand/30 px-3 py-2 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-xs file:text-cream"
//           />
//           <p className="mt-1 text-xs text-warm-gray">Recommended: 1200 × 400 px</p>
//         </div>
//       )}

//       <div className="mt-5 space-y-4">
//         <Input label="Full name" name="full_name" defaultValue={profile.full_name} required />

//         {isCreator && (
//           <>
//             <Input label="Studio / store name" name="store_name" defaultValue={profile.store_name ?? ""} placeholder="Your brand or studio name" />
//             <Input label="Craft / art form" name="craft" defaultValue={profile.craft ?? ""} placeholder="e.g. Blue pottery, Banarasi weave" />
//             <Input label="WhatsApp (with country code)" name="whatsapp" defaultValue={profile.whatsapp ?? ""} placeholder="919876543210" />
//             <Input
//               label="Years of experience (optional)"
//               name="years_experience"
//               type="number"
//               min="0"
//               max="99"
//               defaultValue={profile.years_experience?.toString() ?? ""}
//               placeholder="e.g. 8"
//             />
//             <Textarea label="About Me" name="bio" defaultValue={profile.bio ?? ""} placeholder="Hi, I'm… I create realistic pencil portraits and custom artwork." />
//           </>
//         )}

//         <div className="grid gap-4 sm:grid-cols-2">
//           <Input label="City" name="city" defaultValue={profile.city ?? ""} placeholder="Jaipur" />
//           <Select
//             label="State"
//             name="state"
//             options={[
//               { value: "", label: "Select state" },
//               ...INDIAN_STATES.map((s) => ({ value: s, label: s })),
//             ]}
//             defaultValue={profile.state ?? ""}
//           />
//         </div>
//       </div>

//       <div className="mt-6 flex items-center gap-3">
//         <Button type="submit" disabled={pending}>
//           {pending ? "Saving…" : "Save profile"}
//         </Button>
//         <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// }



"use client";

import { LinksEditor } from "@/components/creators/LinksEditor";

import Image from "next/image";
import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, type AuthState } from "@/lib/actions/auth";
import { addToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { INDIAN_STATES, type Profile } from "@/lib/types";
import { getInitials, formatLocation } from "@/lib/utils";

const initial: AuthState = {};

function SocialIcon({ type }: { type: "instagram" | "whatsapp" | "website" | "youtube" }) {
  if (type === "instagram") return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
  if (type === "whatsapp") return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 10.5c.5-1.8 2.5-2.5 3.5-1.5s1 3 0 3.5l-1 1c.5 1.2 1.8 2.5 3 3l1-1c1-1 3-.5 3.5.5s-.5 3-2 3C12 19 7 15 7 9.5a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  if (type === "youtube") return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 9l5 3-5 3V9Z" fill="currentColor"/>
    </svg>
  );
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateProfile, initial);
  const [editing, setEditing] = useState(false);
  const isCreator = profile.role === "creator";

  useEffect(() => {
    if (state.success) {
      setEditing(false);
      addToast("Profile saved", "success");
      router.refresh();
    }
  }, [state.success, router]);

  const location = formatLocation(profile.city, profile.state);

  // ── View mode ────────────────────────────────────────────
  if (!editing) {
    return (
      <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-xl text-charcoal">
            {isCreator ? "Studio Profile" : "Profile"}
          </h2>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-linen">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-xl text-terracotta">
                {getInitials(profile.full_name)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-charcoal">{profile.full_name}</p>
            {isCreator && profile.craft && (
              <p className="text-sm text-warm-gray">{profile.craft}</p>
            )}
            {location && <p className="text-sm text-warm-gray">{location}</p>}
          </div>
        </div>

        {isCreator && (
          <div className="mt-5 space-y-2 text-sm">
            {profile.store_name && (
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-warm-gray">Studio</span>
                <span className="text-charcoal">{profile.store_name}</span>
              </div>
            )}
            {profile.years_experience && (
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-warm-gray">Experience</span>
                <span className="text-charcoal">{profile.years_experience} years</span>
              </div>
            )}
            {profile.bio && (
              <div className="mt-3 rounded-2xl bg-sand/30 p-3 text-sm leading-relaxed text-charcoal/80">
                {profile.bio}
              </div>
            )}

            {/* Links */}
            {profile.links && profile.links.length > 0 && (
              <div className="mt-4 pt-4 border-t border-linen">
                <p className="text-xs font-medium uppercase tracking-wide text-warm-gray mb-2">Links</p>
                <div className="flex flex-wrap gap-2">
                  {profile.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-linen bg-sand/40 px-3 py-1 text-xs text-charcoal hover:bg-sand transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Edit mode ────────────────────────────────────────────
  return (
    <form
      action={formAction}
      className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-xl text-charcoal">
          {isCreator ? "Edit Studio Profile" : "Edit Profile"}
        </h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>

      {state.error && (
        <p className="mt-3 rounded-2xl bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
          {state.error}
        </p>
      )}

      {/* Avatar */}
      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-linen">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-xl text-terracotta">
              {getInitials(profile.full_name)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-charcoal/80">Profile photo</p>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="mt-1 block w-full cursor-pointer rounded-xl border border-dashed border-linen bg-sand/30 px-3 py-2 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-xs file:text-cream"
          />
        </div>
      </div>

      {/* Banner (creators only) */}
      {isCreator && (
        <div className="mt-4">
          <p className="text-sm font-medium text-charcoal/80">Banner image</p>
          {profile.banner_url && (
            <div className="relative mt-1 h-20 w-full overflow-hidden rounded-xl border border-linen">
              <Image src={profile.banner_url} alt="Current banner" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            name="banner"
            accept="image/*"
            className="mt-1 block w-full cursor-pointer rounded-xl border border-dashed border-linen bg-sand/30 px-3 py-2 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-xs file:text-cream"
          />
          <p className="mt-1 text-xs text-warm-gray">Recommended: 1200 × 400 px</p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <Input label="Full name" name="full_name" defaultValue={profile.full_name} required />

        {isCreator && (
          <>
            <Input label="Studio / store name" name="store_name" defaultValue={profile.store_name ?? ""} placeholder="Your brand or studio name" />
            <Input label="Craft / art form" name="craft" defaultValue={profile.craft ?? ""} placeholder="e.g. Blue pottery, Banarasi weave" />
            <Input
              label="Years of experience (optional)"
              name="years_experience"
              type="number"
              min="0"
              max="99"
              defaultValue={profile.years_experience?.toString() ?? ""}
              placeholder="e.g. 8"
            />
            <Textarea label="About Me" name="bio" defaultValue={profile.bio ?? ""} placeholder="Hi, I'm… I create realistic pencil portraits and custom artwork." />

            {/* Social / Contact links */}
            <div className="rounded-2xl border border-linen bg-sand/20 p-4 space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-saffron">
                Contact &amp; Social Links <span className="normal-case text-warm-gray font-normal tracking-normal">(all optional)</span>
              </p>
              <p className="text-xs text-warm-gray leading-relaxed">
                These appear on your public profile so buyers can reach you directly. You can add or update them anytime.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
                  <SocialIcon type="whatsapp" />
                </span>
                <input
                  name="whatsapp"
                  type="tel"
                  defaultValue={profile.whatsapp ?? ""}
                  placeholder="WhatsApp number with country code — e.g. 919876543210"
                  className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
                  <SocialIcon type="instagram" />
                </span>
                <input
                  name="instagram_url"
                  type="url"
                  defaultValue={profile.instagram_url ?? ""}
                  placeholder="Instagram profile URL — e.g. https://instagram.com/yourstudio"
                  className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
                  <SocialIcon type="website" />
                </span>
                <input
                  name="website_url"
                  type="url"
                  defaultValue={profile.website_url ?? ""}
                  placeholder="Your website — e.g. https://yourname.com"
                  className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
                  <SocialIcon type="youtube" />
                </span>
                <input
                  name="youtube_url"
                  type="url"
                  defaultValue={profile.youtube_url ?? ""}
                  placeholder="YouTube channel — e.g. https://youtube.com/@yourstudio"
                  className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
                />
              </div>
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="City" name="city" defaultValue={profile.city ?? ""} placeholder="Jaipur" />
          <Select
            label="State"
            name="state"
            options={[
              { value: "", label: "Select state" },
              ...INDIAN_STATES.map((s) => ({ value: s, label: s })),
            ]}
            defaultValue={profile.state ?? ""}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}