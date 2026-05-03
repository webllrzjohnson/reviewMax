-- Fix PostgreSQL 42P17: infinite recursion detected in policy for relation "profiles".
-- Symptom: public reads on `posts` fail because "Admins can view all posts" subqueries
-- `profiles`, which re-enters RLS and recurses.
--
-- Run once in Supabase SQL Editor (or psql) on an existing project that used the
-- original policy definitions with `exists (select 1 from public.profiles ...)`.

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

drop policy if exists "Admins insert categories" on public.categories;
drop policy if exists "Admins update categories" on public.categories;
drop policy if exists "Admins delete categories" on public.categories;
create policy "Admins insert categories"
  on public.categories for insert
  with check (public.is_admin());
create policy "Admins update categories"
  on public.categories for update
  using (public.is_admin());
create policy "Admins delete categories"
  on public.categories for delete
  using (public.is_admin());

drop policy if exists "Admins can view all posts" on public.posts;
create policy "Admins can view all posts"
  on public.posts for select
  using (public.is_admin());

drop policy if exists "Admins can view newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins can view newsletter subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());

drop policy if exists "Admins insert review requests" on public.review_requests;
drop policy if exists "Admins view review requests" on public.review_requests;
create policy "Admins insert review requests"
  on public.review_requests for insert
  with check (public.is_admin());
create policy "Admins view review requests"
  on public.review_requests for select
  using (public.is_admin());
