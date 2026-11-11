-- Leads table for the reach estimator, Cal bookings and nurture sequences.
-- Run once in the database the Lovable app uses (project mvdhkxlkhpapenoqptcq).
-- If the project is on Lovable Cloud, paste this into Lovable and ask it to run it as a migration.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null check (char_length(email) between 3 and 254),
  company text not null check (char_length(company) between 1 and 200),
  name text check (char_length(name) <= 200),
  phone text check (char_length(phone) <= 40),
  newsletter_consent boolean not null default false,
  source text not null check (char_length(source) <= 60),
  -- estimate_requested, call_booked, no_show, call_done, won, lost
  stage text not null default 'estimate_requested',
  estimate_input jsonb,
  estimate_result jsonb,
  attribution jsonb not null default '{}'::jsonb,
  notes text
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_created_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- The website can add leads with the publishable key, but can never read them.
grant insert on public.leads to anon;
drop policy if exists "website can submit leads" on public.leads;
create policy "website can submit leads" on public.leads
  for insert to anon
  with check (stage = 'estimate_requested');

-- Reading leads happens through the admin api edge function (service role),
-- the same way the admin dashboard reads every other table.
