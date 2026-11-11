-- Leads table for the reach estimator, Cal bookings and nurture sequences.
-- Run once in the Supabase (or Lovable Cloud) SQL editor.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  company text not null,
  name text,
  phone text,
  newsletter_consent boolean not null default false,
  source text not null,
  -- estimate_requested, call_booked, no_show, call_done, won, lost
  stage text not null default 'estimate_requested',
  estimate_input jsonb,
  estimate_result jsonb,
  attribution jsonb not null default '{}'::jsonb,
  notes text
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_stage_idx on public.leads (stage);

-- Row level security on, with no public policies: only the server (service role key)
-- can write. Add an admin-only select policy that matches how the admin dashboard
-- identifies admins, so the Leads tab can read this table.
alter table public.leads enable row level security;
