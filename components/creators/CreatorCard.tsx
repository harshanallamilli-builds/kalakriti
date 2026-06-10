import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { formatLocation, getInitials } from "@/lib/utils";

type CreatorCardProps = {
  creator: Profile;
  completedOrders?: number;
};

export function CreatorCard({ creator, completedOrders }: CreatorCardProps) {
  const location = formatLocation(creator.city, creator.state);

  return (
    <Link
      href={`/creators/${creator.id}`}
      className="group flex flex-col items-center rounded-3xl border border-linen/80 bg-white p-6 text-center shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      {/* Avatar */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-linen ring-offset-2 ring-offset-cream">
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.store_name || creator.full_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-2xl text-terracotta">
            {getInitials(creator.full_name)}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-heading text-xl text-charcoal group-hover:text-terracotta">
        {creator.store_name || creator.full_name}
      </h3>

      {creator.craft && (
        <p className="mt-1 text-sm text-saffron font-medium">{creator.craft}</p>
      )}

      {/* Availability badge */}
      <span
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          creator.available_for_commissions
            ? "bg-sage/15 text-moss"
            : "bg-linen text-warm-gray"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            creator.available_for_commissions ? "bg-sage" : "bg-warm-gray/40"
          }`}
        />
        {creator.available_for_commissions ? "Available for commissions" : "Not taking orders"}
      </span>

      {/* Trust meta */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {location && (
          <span className="text-xs text-warm-gray">📍 {location}</span>
        )}
        {typeof completedOrders === "number" && completedOrders > 0 && (
          <span className="text-xs text-warm-gray">
            ✅ {completedOrders} {completedOrders === 1 ? "order" : "orders"} completed
          </span>
        )}
      </div>

      {creator.bio && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-warm-gray">
          {creator.bio}
        </p>
      )}
    </Link>
  );
}
