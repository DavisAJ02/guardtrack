-- V3 Phase 3: tighten activity log write permissions.
-- Restricts inserts to supervisor/admin roles and binds actor fields to JWT identity when provided.

drop policy if exists "Authenticated users can insert activity logs" on public.activity_logs;
drop policy if exists "Supervisors and admins can insert activity logs" on public.activity_logs;

create policy "Supervisors and admins can insert activity logs"
on public.activity_logs
for insert
to authenticated
with check (
  coalesce(
    auth.jwt() ->> 'role',
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role',
    ''
  ) in ('admin', 'supervisor')
  and (actor_id is null or actor_id = auth.uid())
  and (
    actor_email is null
    or actor_email = coalesce(auth.jwt() ->> 'email', auth.jwt() -> 'user_metadata' ->> 'email')
  )
);
