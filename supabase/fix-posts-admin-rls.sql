-- Allow admins to insert, update, and delete posts (dashboard management).
-- Safe to re-run: drops policies if present, then recreates.

drop policy if exists "Admins insert posts" on public.posts;
drop policy if exists "Admins update posts" on public.posts;
drop policy if exists "Admins delete posts" on public.posts;

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
