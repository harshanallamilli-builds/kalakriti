import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Single shared instance for the entire browser session.
// Multiple calls to createBrowserClient() each open their own WebSocket —
// causing realtime channels to silently fail or race each other.
let _client: SupabaseClient | null = null;

export function createClient() {
  if (_client) return _client;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return _client;
}