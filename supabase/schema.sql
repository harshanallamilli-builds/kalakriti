-- Kalakriti — Indian handmade marketplace schema
-- Run in Supabase SQL Editor after creating a project.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────
do $$ begin
  create type public.user_role as enum ('user', 'creator');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────
-- Profiles (extends auth.users)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        public.user_role not null,
  full_name   text not null,
  email       text not null,
  avatar_url  text,
  bio         text,
  craft       text,
  store_name  text,
  city        text,
  state       text,
  whatsapp    text,
  onboarding_complete boolean default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx    on public.profiles (role);
create index if not exists profiles_created_idx on public.profiles (created_at desc);

alter table public.profiles enable row level security;

create policy if not exists "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy if not exists "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  creator_id  uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  description text not null default '',
  price_inr   numeric(12, 2) not null check (price_inr >= 0),
  category    text not null,
  image_url   text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_creator_idx  on public.products (creator_id);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx   on public.products (is_active) where is_active = true;

alter table public.products enable row level security;

create policy if not exists "Active products are public"
  on public.products for select
  using (is_active = true or creator_id = auth.uid());

create policy if not exists "Creators insert own products"
  on public.products for insert
  with check (
    creator_id = auth.uid()
    and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'creator'
    )
  );

create policy if not exists "Creators update own products"
  on public.products for update
  using (creator_id = auth.uid());

create policy if not exists "Creators delete own products"
  on public.products for delete
  using (creator_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────
-- Conversations
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  creator_id  uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint different_participants check (user_id <> creator_id)
);

create unique index if not exists conversations_unique_thread
  on public.conversations (user_id, creator_id, coalesce(product_id, '00000000-0000-0000-0000-000000000000'::uuid));

alter table public.conversations enable row level security;

create policy if not exists "Participants view conversations"
  on public.conversations for select
  using (auth.uid() = user_id or auth.uid() = creator_id);

create policy if not exists "Users start conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

create policy if not exists "Participants update conversations"
  on public.conversations for update
  using (auth.uid() = user_id or auth.uid() = creator_id);

-- ─────────────────────────────────────────────────────────────────
-- Messages
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  body             text not null default '' check (char_length(trim(body)) >= 0),
  image_url        text default null,
  read_at          timestamptz default null,
  created_at       timestamptz not null default now(),
  -- At least one of body or image_url must be present
  constraint message_has_content check (
    char_length(trim(body)) > 0 or image_url is not null
  )
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists messages_read_at_idx on public.messages (conversation_id, read_at) where read_at is null;

alter table public.messages enable row level security;

create policy if not exists "Participants view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_id = auth.uid() or c.creator_id = auth.uid())
    )
  );

create policy if not exists "Participants send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_id = auth.uid() or c.creator_id = auth.uid())
    )
  );

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
-- Conversation read state (tracks last-read per user per conversation)
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

-- ─────────────────────────────────────────────────────────────────
-- Orders (MVP — no payments)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  creator_id      uuid not null references public.profiles(id) on delete cascade,
  product_id      uuid references public.products(id) on delete set null,
  status          public.order_status not null default 'pending',
  notes           text,
  custom_request  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_creator_idx on public.orders (creator_id, created_at desc);
create index if not exists orders_user_idx    on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

create policy if not exists "Parties view orders"
  on public.orders for select
  using (auth.uid() = user_id or auth.uid() = creator_id);

create policy if not exists "Users create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy if not exists "Creators update order status"
  on public.orders for update
  using (auth.uid() = creator_id);

create policy if not exists "Users cancel own pending orders"
  on public.orders for update
  using (auth.uid() = user_id and status = 'pending');

-- ─────────────────────────────────────────────────────────────────
-- Feedback
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  category    text not null default 'general',
  message     text not null check (char_length(trim(message)) >= 5),
  created_at  timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy if not exists "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

-- Only service role can read feedback (admin dashboard)
-- No select policy needed for public — service role bypasses RLS

-- ─────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create or replace trigger conversations_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create or replace trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- Storage bucket policies
-- Run after creating buckets "product-images", "avatars", and "chat-images"
-- (all public) in the Supabase dashboard → Storage.
-- ─────────────────────────────────────────────────────────────────

-- product-images
create policy if not exists "Product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy if not exists "Creators can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy if not exists "Creators can update own product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Creators can delete own product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- avatars
create policy if not exists "Avatars are public"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy if not exists "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- chat-images (Phase C)
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

create policy if not exists "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────────────
-- Supabase Realtime
-- Enable realtime for these tables in Supabase dashboard →
-- Database → Replication → Tables → enable for:
--   messages, conversations, orders, profiles
-- ─────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────
-- Migration: product snapshot columns on orders
-- Stores name + image at order-placement time so deleted products
-- can still display meaningful context in order history.
-- Safe to re-run (alter column is idempotent if column already exists).
-- ─────────────────────────────────────────────────────────────────
do $$ begin
  alter table public.orders add column product_name_snapshot  text;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.orders add column product_image_snapshot text;
exception when duplicate_column then null; end $$;

-- Migration: soft-delete support — orders use product FK with on delete set null.
-- No schema change needed; product deletion now sets is_active = false instead of
-- hard-deleting, so the FK remains intact and order joins still resolve.

-- ─────────────────────────────────────────────────────────────────
-- Migration: creator cancellation support
-- Adds cancelled_by and cancel_reason columns to orders.
-- Safe to re-run (idempotent via exception handlers).
-- ─────────────────────────────────────────────────────────────────
do $$ begin
  alter table public.orders add column cancelled_by text check (cancelled_by in ('customer', 'creator'));
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.orders add column cancel_reason text;
exception when duplicate_column then null; end $$;

-- Allow users to cancel their own pending orders (customer cancel)
drop policy if exists "Users cancel own pending orders" on public.orders;
create policy "Users cancel own pending orders"
  on public.orders for update
  using (auth.uid() = user_id and status = 'pending');

-- ─────────────────────────────────────────────────────────────────
-- Migration: order_updates — creator progress notes per order
-- Safe to re-run.
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.order_updates (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_updates_order_idx on public.order_updates (order_id, created_at desc);

alter table public.order_updates enable row level security;

-- Both parties on the order can view updates
create policy if not exists "Order parties view updates"
  on public.order_updates for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or o.creator_id = auth.uid())
    )
  );

-- Only the creator of the order can post updates
create policy if not exists "Creator posts updates"
  on public.order_updates for insert
  with check (
    creator_id = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = order_id and o.creator_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────
-- Migration: order status timestamps
-- Records when each milestone occurred.
-- ─────────────────────────────────────────────────────────────────
do $$ begin
  alter table public.orders add column confirmed_at  timestamptz;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.orders add column in_progress_at timestamptz;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.orders add column completed_at  timestamptz;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.orders add column cancelled_at  timestamptz;
exception when duplicate_column then null; end $$;

-- Trigger: auto-stamp milestone columns on status change
create or replace function public.stamp_order_milestones()
returns trigger as $$
begin
  if new.status = 'confirmed'   and old.status <> 'confirmed'   then new.confirmed_at   = now(); end if;
  if new.status = 'in_progress' and old.status <> 'in_progress' then new.in_progress_at = now(); end if;
  if new.status = 'completed'   and old.status <> 'completed'   then new.completed_at   = now(); end if;
  if new.status = 'cancelled'   and old.status <> 'cancelled'   then new.cancelled_at   = now(); end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_milestone_stamps on public.orders;
create trigger orders_milestone_stamps
  before update on public.orders
  for each row execute function public.stamp_order_milestones();

-- ─────────────────────────────────────────────────────────────────
-- Phase A: Creator Identity & Portfolio
-- ─────────────────────────────────────────────────────────────────

-- New columns on profiles
do $$ begin
  alter table public.profiles add column banner_url text;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.profiles add column years_experience integer;
exception when duplicate_column then null; end $$;

do $$ begin
  alter table public.profiles add column available_for_commissions boolean not null default true;
exception when duplicate_column then null; end $$;

-- Portfolio items table (not for sale, showcase only)
create table if not exists public.portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  creator_id  uuid not null references public.profiles(id) on delete cascade,
  image_url   text not null,
  caption     text,
  created_at  timestamptz not null default now()
);

create index if not exists portfolio_creator_idx on public.portfolio_items (creator_id, created_at desc);

alter table public.portfolio_items enable row level security;

create policy if not exists "Portfolio items are public"
  on public.portfolio_items for select using (true);

create policy if not exists "Creators manage own portfolio"
  on public.portfolio_items for insert
  with check (creator_id = auth.uid());

create policy if not exists "Creators delete own portfolio"
  on public.portfolio_items for delete
  using (creator_id = auth.uid());

-- Storage: banners bucket policies
create policy if not exists "Banners are public"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy if not exists "Creators upload own banner"
  on storage.objects for insert
  with check (bucket_id = 'banners' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Creators update own banner"
  on storage.objects for update
  using (bucket_id = 'banners' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage: portfolio bucket policies
create policy if not exists "Portfolio images are public"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy if not exists "Creators upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy if not exists "Creators delete own portfolio images"
  on storage.objects for delete
  using (bucket_id = 'portfolio' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────────────
-- Phase B additions
-- ─────────────────────────────────────────────────────────────────

-- Add title column to portfolio_items
do $$ begin
  alter table public.portfolio_items add column title text;
exception when duplicate_column then null; end $$;

-- Notifications table
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text not null default '',
  is_read     boolean not null default false,
  href        text,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications (user_id, is_read) where is_read = false;

alter table public.notifications enable row level security;

create policy if not exists "Users read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy if not exists "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Any authenticated user (or service role) can insert notifications.
-- Server actions use the service-role admin client which bypasses RLS entirely,
-- but this policy also allows the anon-key server client as a fallback.
-- NOTE: with check (true) means no row-level restriction on INSERT — any
-- authenticated caller may create a notification for any user_id.
create policy if not exists "Authenticated users can insert notifications"
  on public.notifications for insert
  to authenticated
  with check (true);

-- Service role inserts bypass RLS automatically; the policy above covers anon key.
