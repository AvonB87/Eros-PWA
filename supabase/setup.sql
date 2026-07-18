-- ============================================================
-- EROS PWA - CELOTNA SUPABASE NASTAVITEV
-- Zaženi v Supabase Dashboard > SQL Editor > New query.
-- ============================================================

create extension if not exists pgcrypto;

-- ----------------------------
-- 1. TABELE
-- ----------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  join_code text not null unique
    default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  created_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  birth_date date,
  breed text,
  weight numeric(6, 2) check (weight is null or weight >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  event_type text not null check (
    event_type in (
      'poop',
      'meal',
      'treat',
      'walk',
      'medicine',
      'spot_on',
      'deworming',
      'weight',
      'vet',
      'grooming',
      'note'
    )
  ),
  event_time timestamptz not null,
  title text not null check (char_length(title) between 1 and 100),
  quantity numeric,
  unit text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists household_members_user_id_idx
  on public.household_members(user_id);

create index if not exists pets_household_id_idx
  on public.pets(household_id);

create index if not exists events_pet_time_idx
  on public.events(pet_id, event_time desc);

-- ----------------------------
-- 2. FUNKCIJE IN TRIGGERJI
-- ----------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(new.email, 'uporabnik'), '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Za uporabnike, ki so morda obstajali že pred zagonom skripte.
insert into public.profiles (id, display_name)
select
  users.id,
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''),
    split_part(coalesce(users.email, 'uporabnik'), '@', 1)
  )
from auth.users as users
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

-- Te funkcije uporabljajo RLS pravila in preprečijo rekurzijo
-- pri preverjanju članstva v household_members.
create or replace function public.is_household_member(
  p_household_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = p_household_id
      and user_id = p_user_id
  );
$$;

create or replace function public.is_household_owner(
  p_household_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = p_household_id
      and user_id = p_user_id
      and role = 'owner'
  );
$$;

create or replace function public.shares_household(
  p_other_user_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_members mine
    join public.household_members theirs
      on theirs.household_id = mine.household_id
    where mine.user_id = p_user_id
      and theirs.user_id = p_other_user_id
  );
$$;

create or replace function public.create_household_with_pet(
  p_household_name text,
  p_pet_name text,
  p_birth_date date default null,
  p_breed text default null,
  p_weight numeric default null
)
returns table (
  household_id uuid,
  pet_id uuid,
  join_code text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_household_id uuid;
  v_pet_id uuid;
  v_join_code text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if nullif(trim(p_household_name), '') is null then
    raise exception 'Household name is required';
  end if;

  if nullif(trim(p_pet_name), '') is null then
    raise exception 'Pet name is required';
  end if;

  if exists (
    select 1
    from public.household_members
    where user_id = v_user_id
  ) then
    raise exception 'User already belongs to a household';
  end if;

  insert into public.households as h (name)
  values (trim(p_household_name))
  returning h.id, h.join_code
  into v_household_id, v_join_code;

  insert into public.household_members (household_id, user_id, role)
  values (v_household_id, v_user_id, 'owner');

  insert into public.pets (
    household_id,
    name,
    birth_date,
    breed,
    weight
  )
  values (
    v_household_id,
    trim(p_pet_name),
    p_birth_date,
    nullif(trim(p_breed), ''),
    p_weight
  )
  returning id into v_pet_id;

  return query
  select v_household_id, v_pet_id, v_join_code;
end;
$$;

create or replace function public.join_household_by_code(
  p_join_code text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_household_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if exists (
    select 1
    from public.household_members
    where user_id = v_user_id
  ) then
    raise exception 'User already belongs to a household';
  end if;

  select id
  into v_household_id
  from public.households
  where join_code = upper(trim(p_join_code));

  if v_household_id is null then
    raise exception 'Invalid join code';
  end if;

  insert into public.household_members (household_id, user_id, role)
  values (v_household_id, v_user_id, 'member')
  on conflict (household_id, user_id) do nothing;

  return v_household_id;
end;
$$;

-- ----------------------------
-- 3. RLS
-- ----------------------------

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.pets enable row level security;
alter table public.events enable row level security;

drop policy if exists "profiles_select_shared_household" on public.profiles;
create policy "profiles_select_shared_household"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.shares_household(id)
);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "households_select_members" on public.households;
create policy "households_select_members"
on public.households
for select
to authenticated
using (public.is_household_member(id));

drop policy if exists "households_update_owner" on public.households;
create policy "households_update_owner"
on public.households
for update
to authenticated
using (public.is_household_owner(id))
with check (public.is_household_owner(id));

drop policy if exists "members_select_same_household" on public.household_members;
create policy "members_select_same_household"
on public.household_members
for select
to authenticated
using (public.is_household_member(household_id));

drop policy if exists "members_delete_owner" on public.household_members;
create policy "members_delete_owner"
on public.household_members
for delete
to authenticated
using (
  public.is_household_owner(household_id)
  and user_id <> auth.uid()
);

drop policy if exists "pets_select_members" on public.pets;
create policy "pets_select_members"
on public.pets
for select
to authenticated
using (public.is_household_member(household_id));

drop policy if exists "pets_insert_members" on public.pets;
create policy "pets_insert_members"
on public.pets
for insert
to authenticated
with check (public.is_household_member(household_id));

drop policy if exists "pets_update_members" on public.pets;
create policy "pets_update_members"
on public.pets
for update
to authenticated
using (public.is_household_member(household_id))
with check (public.is_household_member(household_id));

drop policy if exists "pets_delete_owner" on public.pets;
create policy "pets_delete_owner"
on public.pets
for delete
to authenticated
using (public.is_household_owner(household_id));

drop policy if exists "events_select_members" on public.events;
create policy "events_select_members"
on public.events
for select
to authenticated
using (
  exists (
    select 1
    from public.pets
    where pets.id = events.pet_id
      and public.is_household_member(pets.household_id)
  )
);

drop policy if exists "events_insert_members" on public.events;
create policy "events_insert_members"
on public.events
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.pets
    where pets.id = events.pet_id
      and public.is_household_member(pets.household_id)
  )
);

drop policy if exists "events_update_members" on public.events;
create policy "events_update_members"
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.pets
    where pets.id = events.pet_id
      and public.is_household_member(pets.household_id)
  )
)
with check (
  exists (
    select 1
    from public.pets
    where pets.id = events.pet_id
      and public.is_household_member(pets.household_id)
  )
);

drop policy if exists "events_delete_members" on public.events;
create policy "events_delete_members"
on public.events
for delete
to authenticated
using (
  exists (
    select 1
    from public.pets
    where pets.id = events.pet_id
      and public.is_household_member(pets.household_id)
  )
);

-- ----------------------------
-- 4. PRAVICE ZA FUNKCIJE
-- ----------------------------

revoke all on function public.is_household_member(uuid, uuid) from public;
revoke all on function public.is_household_owner(uuid, uuid) from public;
revoke all on function public.shares_household(uuid, uuid) from public;
revoke all on function public.create_household_with_pet(text, text, date, text, numeric) from public;
revoke all on function public.join_household_by_code(text) from public;

grant execute on function public.is_household_member(uuid, uuid) to authenticated;
grant execute on function public.is_household_owner(uuid, uuid) to authenticated;
grant execute on function public.shares_household(uuid, uuid) to authenticated;
grant execute on function public.create_household_with_pet(text, text, date, text, numeric) to authenticated;
grant execute on function public.join_household_by_code(text) to authenticated;

-- ----------------------------
-- 5. REALTIME ZA DOGODKE
-- ----------------------------

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'events'
  ) then
    alter publication supabase_realtime add table public.events;
  end if;
end
$$;

-- Konec. Po zagonu preveri, da ni bilo rdeče napake.
