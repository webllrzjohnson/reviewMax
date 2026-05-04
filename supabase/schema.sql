-- Review Product Site — Supabase schema, RLS, seed data
-- Run in Supabase SQL Editor (single project).

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  body text not null,
  category_id uuid not null references public.categories (id) on delete restrict,
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  verdict text not null,
  amazon_url text not null,
  image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  full_name text,
  created_at timestamptz not null default now()
);

create table public.review_requests (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  category_slug text not null,
  amazon_url text not null,
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

create index posts_slug_idx on public.posts (slug);
create index posts_category_id_idx on public.posts (category_id);
create index posts_is_published_idx on public.posts (is_published);
create index posts_published_at_idx on public.posts (published_at desc);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Auth: profile on signup
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    'user',
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- RLS helpers (avoid 42P17: infinite recursion when policies subquery profiles)
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select p.role = 'admin'
      from public.profiles p
      where p.id = auth.uid()
    ),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.profiles enable row level security;
alter table public.review_requests enable row level security;

-- Categories: public read; admin write
create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Admins insert categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "Admins update categories"
  on public.categories for update
  using (public.is_admin());

create policy "Admins delete categories"
  on public.categories for delete
  using (public.is_admin());

-- Posts: public read published; admin read all; service role bypasses RLS
create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (is_published = true);

create policy "Admins can view all posts"
  on public.posts for select
  using (public.is_admin());

create policy "Admins insert posts"
  on public.posts for insert
  with check (public.is_admin());

create policy "Admins update posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete posts"
  on public.posts for delete
  using (public.is_admin());

-- Newsletter
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admins can view newsletter subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Review requests (admin only)
create policy "Admins insert review requests"
  on public.review_requests for insert
  with check (public.is_admin());

create policy "Admins view review requests"
  on public.review_requests for select
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed: categories (fixed IDs for sample posts)
-- -----------------------------------------------------------------------------

insert into public.categories (id, name, slug, description) values
  (
    '11111111-1111-1111-1111-111111111101',
    'Kitchen Gadgets',
    'kitchen-gadgets',
    'Small appliances, knives, organizers, and clever tools for the kitchen.'
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'Home Tech',
    'home-tech',
    'Smart home gear, audio, lighting, and everyday electronics.'
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'Fitness Gear',
    'fitness-gear',
    'Recovery tools, wearables, weights, and training accessories.'
  )
on conflict (slug) do-nothing;

-- -----------------------------------------------------------------------------
-- Seed: sample posts
-- -----------------------------------------------------------------------------

insert into public.posts (
  title,
  slug,
  excerpt,
  body,
  category_id,
  rating,
  pros,
  cons,
  verdict,
  amazon_url,
  image_url,
  is_published,
  published_at
) values (
  'ThermoBlend Pro Immersion Blender Review: soups without the splatter',
  'thermoblend-pro-immersion-blender-review',
  'A powerful immersion blender that handles hot soups, smoothies, and baby food with less mess—here is how it performed in real-world tests.',
  E'After two weeks of daily use, the ThermoBlend Pro felt like the rare kitchen gadget that earns its drawer space. The motor has two steady speeds plus a pulse mode, and the shaft is long enough for a deep stock pot without feeling top-heavy.\n\n**What we tested**\n\n- Hot butternut squash soup (2 liters)\n- Peanut butter smoothie with frozen fruit\n- Small-batch pesto and chimichurri\n\nBlending hot liquids can be scary; the blade guard and angled bell kept splash-back surprisingly low compared with older models I have used. Cleanup is simple: twist off the shaft, rinse, and run the dishwasher-safe parts on the top rack.\n\nNoise is moderate—not whisper quiet, but not “wake the baby” loud either. The handle stayed cool during extended blending, and the cord length is generous for countertop work.',
  '11111111-1111-1111-1111-111111111101',
  4.5,
  array[
    'Strong motor; smooth results on tough ingredients',
    'Thoughtful design reduces splatter with hot liquids',
    'Easy-to-clean shaft; dishwasher-safe parts',
    'Comfortable grip for longer blending sessions'
  ],
  array[
    'Heavier than basic immersion blenders',
    'No cordless option',
    'Premium price versus entry-level models'
  ],
  'A standout immersion blender for cooks who blend hot soups often. If you only need occasional smoothies, a cheaper model may suffice; for frequent use, this one is worth it.',
  'https://www.amazon.com/dp/B0PLACEHOLD1',
  'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=1200&q=80',
  true,
  now() - interval '5 days'
),
(
  'PulseBand Air Fitness Tracker Review: lightweight motivation',
  'pulseband-air-fitness-tracker-review',
  'A slim fitness tracker focused on steps, sleep, and heart rate alerts—see whether it is accurate enough to replace a smartwatch for daily training.',
  E'The PulseBand Air targets people who want tracking without a bulky screen. In practice, the band is comfortable enough to sleep in, and the clasp stayed secure during runs and kettlebell sessions. Pairing took under a minute using the companion app.\n\n**Accuracy**\n\nStep counts were within ~3% of a control treadmill tally across five-mile sessions. Resting heart rate matched a chest strap within a beat on most mornings. Sleep staging felt directionally helpful—deep sleep aligned with how groggy I felt—even if it is not medical-grade.\n\n**Battery and app**\n\nBattery landed around six days with nightly sleep tracking and daytime notifications disabled. The app is clean but not flashy; you get trends for activity, sleep debt, and HRV-style stress prompts if you enable them.\n\nIf you need GPS for outdoor routes without your phone, you will want a different device. For daily accountability and gentle nudges, the PulseBand Air is a compelling mid-range pick.',
  '11111111-1111-1111-1111-111111111103',
  4.2,
  array[
    'Lightweight, low-profile design',
    'Solid battery life for its size',
    'Heart rate alerts felt responsive',
    'Straightforward app with clear trends'
  ],
  array[
    'No built-in GPS',
    'Screen is readable but not premium AMOLED',
    'Limited third-party integrations'
  ],
  'Best for walkers, gym-goers, and sleep trackers who do not need a full smartwatch. Serious athletes may still prefer GPS-first hardware.',
  'https://www.amazon.com/dp/B0PLACEHOLD2',
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80',
  true,
  now() - interval '2 days'
)
on conflict (slug) do-nothing;
