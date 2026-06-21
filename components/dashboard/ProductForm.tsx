// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { createProduct, updateProduct } from "@/lib/actions/products";
// import type { ActionState } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
// import { Textarea } from "@/components/ui/Textarea";
// import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
// import { formatINR } from "@/lib/utils";

// const initial: ActionState = {};

// type ProductFormProps = {
//   product?: Product;
// };

// export function ProductForm({ product }: ProductFormProps) {
//   const router = useRouter();
//   const isEdit = Boolean(product);
//   const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;
//   const [state, formAction, pending] = useActionState(action, initial);
//   const [editing, setEditing] = useState(!isEdit); // new product starts in edit mode

//   const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

//   // After create: navigate to the creator dashboard.
//   // The server action already called revalidatePath("/dashboard/creator") so the
//   // SSR cache is marked stale. We push directly — do NOT call router.refresh()
//   // before the push, because that triggers a refetch of the *current* page
//   // (the new-product form) while we're simultaneously navigating away, which
//   // can cause Next.js App Router to 404 the destination route.
//   // router.refresh() after push is also unnecessary here because the destination
//   // page will be fetched fresh (the cache was already invalidated server-side).
//   useEffect(() => {
//     if (state.redirectTo) {
//       router.push(state.redirectTo);
//     }
//   }, [state.redirectTo, router]);

//   // After edit save: exit to view mode and bust the SSR cache so the updated
//   // product data is reflected if the user navigates back to this page.
//   useEffect(() => {
//     if (state.success && isEdit && !state.redirectTo) {
//       setEditing(false);
//       router.refresh();
//     }
//   }, [state.success, isEdit, state.redirectTo, router]);

//   // ── Edit product view mode (after save) ──────────────────
//   if (isEdit && !editing && product) {
//     return (
//       <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
//         <div className="flex items-start justify-between gap-4">
//           <h2 className="font-heading text-2xl text-charcoal">{product.name}</h2>
//           <div className="flex items-center gap-2 shrink-0">
//             <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
//               Edit
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
//               ← Back
//             </Button>
//           </div>
//         </div>

//         {state.success && (
//           <p className="mt-3 rounded-2xl bg-sage/15 px-4 py-2.5 text-sm text-moss">
//             Product updated successfully.
//           </p>
//         )}

//         <div className="mt-5 grid gap-6 sm:grid-cols-2">
//           {product.image_url && (
//             <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand sm:row-span-2">
//               <Image src={product.image_url} alt={product.name} fill className="object-cover" />
//             </div>
//           )}
//           <div className="space-y-3 text-sm">
//             <div>
//               <p className="text-warm-gray">Price</p>
//               <p className="font-heading text-2xl text-charcoal">{formatINR(Number(product.price_inr))}</p>
//             </div>
//             <div>
//               <p className="text-warm-gray">Category</p>
//               <p className="text-charcoal">{product.category}</p>
//             </div>
//             <div>
//               <p className="text-warm-gray">Status</p>
//               <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${product.is_active ? "bg-sage/15 text-moss" : "bg-sand text-warm-gray"}`}>
//                 {product.is_active ? "Active Listing" : "Archived"}
//               </span>
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <p className="text-warm-gray text-sm">Description</p>
//             <p className="mt-1 leading-relaxed text-charcoal/80">{product.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Form (create or edit) ─────────────────────────────────
//   return (
//     <form
//       action={formAction}
//       className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-heading text-2xl text-charcoal">
//             {isEdit ? "Edit piece" : "Add new piece"}
//           </h2>
//           <p className="mt-1 text-sm text-warm-gray">Price in Indian Rupees (₹)</p>
//         </div>
//         <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
//           ← Back
//         </Button>
//       </div>

//       {state.error && (
//         <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
//           {state.error}
//         </p>
//       )}

//       <div className="mt-6 grid gap-4 md:grid-cols-2">
//         <Input
//           label="Piece name"
//           name="name"
//           defaultValue={product?.name}
//           required
//           placeholder="e.g. Hand-thrown terracotta bowl"
//         />
//         <Input
//           label="Price (₹)"
//           name="price_inr"
//           type="number"
//           min="1"
//           step="1"
//           defaultValue={product?.price_inr}
//           required
//           placeholder="e.g. 1200"
//         />
//         <Select
//           label="Category"
//           name="category"
//           options={categoryOptions}
//           defaultValue={product?.category ?? PRODUCT_CATEGORIES[0]}
//         />
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-charcoal/80">
//             Product image {isEdit ? "(leave empty to keep current)" : "*"}
//           </label>
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             required={!isEdit}
//             className="rounded-2xl border border-dashed border-linen bg-sand/30 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-cream cursor-pointer"
//           />
//           <p className="text-xs text-warm-gray">JPG, PNG or WEBP. Max 5MB.</p>
//         </div>



//         <div className="md:col-span-2">
//           <Textarea
//             label="Description"
//             name="description"
//             defaultValue={product?.description}
//             required
//             placeholder="Describe the piece, materials, dimensions, and what makes it special…"
//           />
//         </div>
//       </div>

//       {isEdit && product?.image_url && (
//         <div className="mt-5">
//           <p className="mb-2 text-xs text-warm-gray">Current image</p>
//           <div className="relative h-40 w-32 overflow-hidden rounded-2xl bg-sand shadow-[var(--shadow-card)]">
//             <Image src={product.image_url} alt="" fill className="object-cover" />
//           </div>
//         </div>
//       )}

//       <div className="mt-6 flex items-center gap-3">
//         <Button type="submit" variant="secondary" disabled={pending}>
//           {pending ? "Saving…" : isEdit ? "Update piece" : "Publish piece"}
//         </Button>
//         {isEdit && (
//           <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
//             Cancel
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// }


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

// function SocialIcon({ type }: { type: "instagram" | "whatsapp" | "website" | "youtube" }) {
//   if (type === "instagram") return (
//     <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//       <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
//       <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
//       <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
//     </svg>
//   );
//   if (type === "whatsapp") return (
//     <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//       <path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M9 10.5c.5-1.8 2.5-2.5 3.5-1.5s1 3 0 3.5l-1 1c.5 1.2 1.8 2.5 3 3l1-1c1-1 3-.5 3.5.5s-.5 3-2 3C12 19 7 15 7 9.5a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//     </svg>
//   );
//   if (type === "youtube") return (
//     <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//       <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M10 9l5 3-5 3V9Z" fill="currentColor"/>
//     </svg>
//   );
//   return (
//     <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.3"/>
//     </svg>
//   );
// }

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

//             {/* Social / Contact Links */}
//             {(profile.whatsapp || profile.instagram_url || profile.website_url || profile.youtube_url) && (
//               <div className="mt-4 pt-4 border-t border-linen">
//                 <p className="text-xs font-medium uppercase tracking-wide text-warm-gray mb-2">Links</p>
//                 <div className="flex flex-wrap gap-2">
//                   {profile.whatsapp && (
//                     <a
//                       href={`https://wa.me/${profile.whatsapp}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 rounded-full border border-linen bg-sand/40 px-3 py-1 text-xs text-charcoal hover:bg-sand transition-colors"
//                     >
//                       <SocialIcon type="whatsapp" />WhatsApp
//                     </a>
//                   )}
//                   {profile.instagram_url && (
//                     <a
//                       href={profile.instagram_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 rounded-full border border-linen bg-sand/40 px-3 py-1 text-xs text-charcoal hover:bg-sand transition-colors"
//                     >
//                       <SocialIcon type="instagram" />Instagram
//                     </a>
//                   )}
//                   {profile.website_url && (
//                     <a
//                       href={profile.website_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 rounded-full border border-linen bg-sand/40 px-3 py-1 text-xs text-charcoal hover:bg-sand transition-colors"
//                     >
//                       <SocialIcon type="website" />Website
//                     </a>
//                   )}
//                   {profile.youtube_url && (
//                     <a
//                       href={profile.youtube_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-1.5 rounded-full border border-linen bg-sand/40 px-3 py-1 text-xs text-charcoal hover:bg-sand transition-colors"
//                     >
//                       <SocialIcon type="youtube" />YouTube
//                     </a>
//                   )}
//                 </div>
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

//             {/* Social / Contact links */}
//             <div className="rounded-2xl border border-linen bg-sand/20 p-4 space-y-3">
//               <p className="text-xs font-medium uppercase tracking-wide text-saffron">
//                 Contact &amp; Social Links <span className="normal-case text-warm-gray font-normal tracking-normal">(all optional)</span>
//               </p>
//               <p className="text-xs text-warm-gray leading-relaxed">
//                 These appear on your public profile so buyers can reach you directly. You can add or update them anytime.
//               </p>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
//                   <SocialIcon type="whatsapp" />
//                 </span>
//                 <input
//                   name="whatsapp"
//                   type="tel"
//                   defaultValue={profile.whatsapp ?? ""}
//                   placeholder="WhatsApp number with country code — e.g. 919876543210"
//                   className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
//                   <SocialIcon type="instagram" />
//                 </span>
//                 <input
//                   name="instagram_url"
//                   type="url"
//                   defaultValue={profile.instagram_url ?? ""}
//                   placeholder="Instagram profile URL — e.g. https://instagram.com/yourstudio"
//                   className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
//                   <SocialIcon type="website" />
//                 </span>
//                 <input
//                   name="website_url"
//                   type="url"
//                   defaultValue={profile.website_url ?? ""}
//                   placeholder="Your website — e.g. https://yourname.com"
//                   className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
//                 />
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
//                   <SocialIcon type="youtube" />
//                 </span>
//                 <input
//                   name="youtube_url"
//                   type="url"
//                   defaultValue={profile.youtube_url ?? ""}
//                   placeholder="YouTube channel — e.g. https://youtube.com/@yourstudio"
//                   className="w-full rounded-xl border border-linen bg-white pl-9 pr-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30"
//                 />
//               </div>
//             </div>
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

// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { createProduct, updateProduct } from "@/lib/actions/products";
// import type { ActionState } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
// import { Textarea } from "@/components/ui/Textarea";
// import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
// import { formatINR } from "@/lib/utils";

// const initial: ActionState = {};

// type ProductFormProps = {
//   product?: Product;
// };

// export function ProductForm({ product }: ProductFormProps) {
//   const router = useRouter();
//   const isEdit = Boolean(product);
//   const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;
//   const [state, formAction, pending] = useActionState(action, initial);
//   const [editing, setEditing] = useState(!isEdit); // new product starts in edit mode

//   const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

//   // After create: navigate to the creator dashboard.
//   // The server action already called revalidatePath("/dashboard/creator") so the
//   // SSR cache is marked stale. We push directly — do NOT call router.refresh()
//   // before the push, because that triggers a refetch of the *current* page
//   // (the new-product form) while we're simultaneously navigating away, which
//   // can cause Next.js App Router to 404 the destination route.
//   // router.refresh() after push is also unnecessary here because the destination
//   // page will be fetched fresh (the cache was already invalidated server-side).
//   useEffect(() => {
//     if (state.redirectTo) {
//       router.push(state.redirectTo);
//     }
//   }, [state.redirectTo, router]);

//   // After edit save: exit to view mode and bust the SSR cache so the updated
//   // product data is reflected if the user navigates back to this page.
//   useEffect(() => {
//     if (state.success && isEdit && !state.redirectTo) {
//       setEditing(false);
//       router.refresh();
//     }
//   }, [state.success, isEdit, state.redirectTo, router]);

//   // ── Edit product view mode (after save) ──────────────────
//   if (isEdit && !editing && product) {
//     return (
//       <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
//         <div className="flex items-start justify-between gap-4">
//           <h2 className="font-heading text-2xl text-charcoal">{product.name}</h2>
//           <div className="flex items-center gap-2 shrink-0">
//             <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
//               Edit
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
//               ← Back
//             </Button>
//           </div>
//         </div>

//         {state.success && (
//           <p className="mt-3 rounded-2xl bg-sage/15 px-4 py-2.5 text-sm text-moss">
//             Product updated successfully.
//           </p>
//         )}

//         <div className="mt-5 grid gap-6 sm:grid-cols-2">
//           {product.image_url && (
//             <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand sm:row-span-2">
//               <Image src={product.image_url} alt={product.name} fill className="object-cover" />
//             </div>
//           )}
//           <div className="space-y-3 text-sm">
//             <div>
//               <p className="text-warm-gray">Price</p>
//               <p className="font-heading text-2xl text-charcoal">{formatINR(Number(product.price_inr))}</p>
//             </div>
//             <div>
//               <p className="text-warm-gray">Category</p>
//               <p className="text-charcoal">{product.category}</p>
//             </div>
//             <div>
//               <p className="text-warm-gray">Status</p>
//               <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${product.is_active ? "bg-sage/15 text-moss" : "bg-sand text-warm-gray"}`}>
//                 {product.is_active ? "Active Listing" : "Archived"}
//               </span>
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <p className="text-warm-gray text-sm">Description</p>
//             <p className="mt-1 leading-relaxed text-charcoal/80">{product.description}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Form (create or edit) ─────────────────────────────────
//   return (
//     <form
//       action={formAction}
//       className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-heading text-2xl text-charcoal">
//             {isEdit ? "Edit piece" : "Add new piece"}
//           </h2>
//           <p className="mt-1 text-sm text-warm-gray">Price in Indian Rupees (₹)</p>
//         </div>
//         <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
//           ← Back
//         </Button>
//       </div>

//       {state.error && (
//         <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
//           {state.error}
//         </p>
//       )}

//       <div className="mt-6 grid gap-4 md:grid-cols-2">
//         <Input
//           label="Piece name"
//           name="name"
//           defaultValue={product?.name}
//           required
//           placeholder="e.g. Hand-thrown terracotta bowl"
//         />
//         <Input
//           label="Price (₹)"
//           name="price_inr"
//           type="number"
//           min="1"
//           step="1"
//           defaultValue={product?.price_inr}
//           required
//           placeholder="e.g. 1200"
//         />
//         <Select
//           label="Category"
//           name="category"
//           options={categoryOptions}
//           defaultValue={product?.category ?? PRODUCT_CATEGORIES[0]}
//         />
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-charcoal/80">
//             Product image {isEdit ? "(leave empty to keep current)" : "*"}
//           </label>
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             required={!isEdit}
//             className="rounded-2xl border border-dashed border-linen bg-sand/30 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-cream cursor-pointer"
//           />
//           <p className="text-xs text-warm-gray">JPG, PNG or WEBP. Max 5MB.</p>
//         </div>



//         <div className="md:col-span-2">
//           <Textarea
//             label="Description"
//             name="description"
//             defaultValue={product?.description}
//             required
//             placeholder="Describe the piece, materials, dimensions, and what makes it special…"
//           />
//         </div>
//       </div>

//       {isEdit && product?.image_url && (
//         <div className="mt-5">
//           <p className="mb-2 text-xs text-warm-gray">Current image</p>
//           <div className="relative h-40 w-32 overflow-hidden rounded-2xl bg-sand shadow-[var(--shadow-card)]">
//             <Image src={product.image_url} alt="" fill className="object-cover" />
//           </div>
//         </div>
//       )}

//       <div className="mt-6 flex items-center gap-3">
//         <Button type="submit" variant="secondary" disabled={pending}>
//           {pending ? "Saving…" : isEdit ? "Update piece" : "Publish piece"}
//         </Button>
//         {isEdit && (
//           <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
//             Cancel
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// }

"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { ActionState } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const initial: ActionState = {};

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;
  const [state, formAction, pending] = useActionState(action, initial);
  const [editing, setEditing] = useState(!isEdit); // new product starts in edit mode

  const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

  // After create: navigate to the creator dashboard.
  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  // After edit save: exit to view mode and bust the SSR cache.
  useEffect(() => {
    if (state.success && isEdit && !state.redirectTo) {
      setEditing(false);
      router.refresh();
    }
  }, [state.success, isEdit, state.redirectTo, router]);

  // ── Edit product view mode (after save) ──────────────────
  if (isEdit && !editing && product) {
    return (
      <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl text-charcoal">{product.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
              ← Back
            </Button>
          </div>
        </div>

        {state.success && (
          <p className="mt-3 rounded-2xl bg-sage/15 px-4 py-2.5 text-sm text-moss">
            Product updated successfully.
          </p>
        )}

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {product.image_url && (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand sm:row-span-2">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-warm-gray">Price</p>
              <p className="font-heading text-2xl text-charcoal">{formatINR(Number(product.price_inr))}</p>
            </div>
            <div>
              <p className="text-warm-gray">Category</p>
              <p className="text-charcoal">{product.category}</p>
            </div>
            <div>
              <p className="text-warm-gray">Status</p>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${product.is_active ? "bg-sage/15 text-moss" : "bg-sand text-warm-gray"}`}>
                {product.is_active ? "Active Listing" : "Archived"}
              </span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-warm-gray text-sm">Description</p>
            <p className="mt-1 leading-relaxed text-charcoal/80">{product.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Form (create or edit) ─────────────────────────────────
  return (
    <form
      action={formAction}
      className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl text-charcoal">
            {isEdit ? "Edit piece" : "Add new piece"}
          </h2>
          <p className="mt-1 text-sm text-warm-gray">Price in Indian Rupees (₹)</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
          ← Back
        </Button>
      </div>

      {state.error && (
        <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {state.error}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input
          label="Piece name"
          name="name"
          defaultValue={product?.name}
          required
          placeholder="e.g. Hand-thrown terracotta bowl"
        />
        <Input
          label="Price (₹)"
          name="price_inr"
          type="number"
          min="1"
          step="1"
          defaultValue={product?.price_inr}
          required
          placeholder="e.g. 1200"
        />
        <Select
          label="Category"
          name="category"
          options={categoryOptions}
          defaultValue={product?.category ?? PRODUCT_CATEGORIES[0]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal/80">
            Product image {isEdit ? "(leave empty to keep current)" : "*"}
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required={!isEdit}
            className="rounded-2xl border border-dashed border-linen bg-sand/30 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-cream cursor-pointer"
          />
          <p className="text-xs text-warm-gray">JPG, PNG or WEBP. Max 5MB.</p>
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            name="description"
            defaultValue={product?.description}
            required
            placeholder="Describe the piece, materials, dimensions, and what makes it special…"
          />
        </div>
      </div>

      {isEdit && product?.image_url && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-warm-gray">Current image</p>
          <div className="relative h-40 w-32 overflow-hidden rounded-2xl bg-sand shadow-[var(--shadow-card)]">
            <Image src={product.image_url} alt="" fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Update piece" : "Publish piece"}
        </Button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}