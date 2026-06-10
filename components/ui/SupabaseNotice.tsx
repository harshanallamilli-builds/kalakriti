export function SupabaseNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-saffron/30 bg-saffron/10 px-6 py-4 text-sm text-charcoal">
      <p className="font-medium">Connect your database to see live content</p>
      <p className="mt-1 text-warm-gray">
        Add{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">.env.local</code>
        , run the SQL in{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">
          supabase/schema.sql
        </code>
        , then create two public storage buckets:{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">product-images</code>{" "}
        and{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-xs">avatars</code>.
      </p>
    </div>
  );
}
