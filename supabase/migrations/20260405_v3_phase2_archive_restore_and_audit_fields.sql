-- V3 Phase 2: richer audit payload support
-- Extends activity_logs to store actor and before/after snapshots.

alter table if exists public.activity_logs
  add column if not exists actor_id uuid;

alter table if exists public.activity_logs
  add column if not exists actor_email text;

alter table if exists public.activity_logs
  add column if not exists before_json jsonb;

alter table if exists public.activity_logs
  add column if not exists after_json jsonb;

create index if not exists activity_logs_actor_id_idx
  on public.activity_logs (actor_id);

create index if not exists activity_logs_entity_idx
  on public.activity_logs (entity, entity_id);
