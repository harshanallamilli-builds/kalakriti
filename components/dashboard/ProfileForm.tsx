"use client";

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
            {profile.whatsapp && (
              <div className="flex gap-2">
                <span className="w-28 shrink-0 text-warm-gray">WhatsApp</span>
                <span className="text-charcoal">+{profile.whatsapp}</span>
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
            <Input label="WhatsApp (with country code)" name="whatsapp" defaultValue={profile.whatsapp ?? ""} placeholder="919876543210" />
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
