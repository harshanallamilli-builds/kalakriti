-- ============================================================
-- Phase C: Communication Upgrade Migration
-- Apply in Supabase: SQL Editor → paste → Run
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ─────────────────────────────────────────────────────────────────
-- 1. Extend messages table
-- ─────────────────────────────────────────────────────────────────

-- Add image_url for chat attachments (JPG/PNG/WEBP)
alter table public.messages
  add column if not exists image_url text default null;

-- Add read_at for read receipts
alter table public.messages
  add column if not exists read_at timestamptz default null;

-- Relax body check to allow empty body when image is present
-- Drop old constraint first, then add a better one
alter table public.messages
  drop constraint if exists messages_body_check;

alter table public.messages
  drop constraint if exists message_has_content;

-- Allow body = '' but require at least body or image_url
alter table public.messages
  alter column body set default '';

-- Add the compound content check
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name = 'messages'
      and constraint_name = 'message_has_content'
      and table_schema = 'public'
  ) then
    alter table public.messages
      add constraint message_has_content
        check (char_length(trim(body)) > 0 or image_url is not null);
  end if;
end $$;

-- Performance index for unread queries
create index if not exists messages_read_at_idx
  on public.messages (conversation_id, read_at)
  where read_at is null;

-- Allow participants to update read_at on messages
create policy if not exists "Participants can mark messages read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_id = auth.uid() or c.creator_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_id = auth.uid() or c.creator_id = auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────────
-- 2. conversation_reads — tracks last-read per user per conversation
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.conversation_reads (
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  last_read_at     timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

alter table public.conversation_reads enable row level security;

create policy if not exists "Users manage own read state"
  on public.conversation_reads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable realtime for conversation_reads
alter publication supabase_realtime add table public.conversation_reads;

-- ─────────────────────────────────────────────────────────────────
-- 3. Fix notification type for order placement
--    (was incorrectly using 'new_message' — now 'order_placed')
-- ─────────────────────────────────────────────────────────────────
-- No DB change needed — type column is text, not enum.
-- The server action fix handles this.

-- ─────────────────────────────────────────────────────────────────
-- 4. Storage bucket: chat-images
-- ─────────────────────────────────────────────────────────────────
-- Create in dashboard: Storage → New Bucket → Name: "chat-images" → Public: ON
-- Then these policies will apply:

create policy if not exists "Chat images are public"
  on storage.objects for select
  using (bucket_id = 'chat-images');

create policy if not exists "Authenticated users upload chat images"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-images'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy if not exists "Users delete own chat images"
  on storage.objects for delete
  using (
    bucket_id = 'chat-images'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
