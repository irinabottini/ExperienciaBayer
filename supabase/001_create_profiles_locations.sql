-- Experiencia Bayer: perfiles de usuario y ubicaciones
-- Ejecutar en Supabase SQL Editor.
-- La identidad y el login quedan a cargo de auth.users.

create extension if not exists pgcrypto;

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  source_id integer unique,
  entity text not null,
  name text not null,
  location_type text not null,
  main_activity text,
  published_address text,
  locality text,
  province text,
  latitude numeric(9, 6) not null check (latitude between -90 and 90),
  longitude numeric(9, 6) not null check (longitude between -180 and 180),
  coordinate_quality text not null default 'Sin verificar',
  google_maps_url text,
  notes text,
  status text not null default 'Actual' check (status in ('Actual', 'Asociado', 'Historico', 'Pendiente')),
  site_referent_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_name_unique unique (name)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  role text not null default 'Visita' check (role in (
    'Administrador',
    'Lider',
    'Referente del site',
    'Referente por equipo',
    'Organizador',
    'Visita'
  )),
  primary_location_id uuid references public.locations(id) on delete set null,
  team text,
  area text,
  phone text,
  clothing_size text,
  dietary_condition text,
  favorite_companion_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.locations
  drop constraint if exists locations_site_referent_user_id_fkey;

alter table public.locations
  add constraint locations_site_referent_user_id_fkey
  foreign key (site_referent_user_id)
  references public.profiles(id)
  on delete set null;

create index if not exists locations_coordinates_idx
  on public.locations (latitude, longitude);

create index if not exists locations_referent_idx
  on public.locations (site_referent_user_id);

create index if not exists profiles_primary_location_idx
  on public.profiles (primary_location_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists locations_set_updated_at on public.locations;
create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.locations enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read locations" on public.locations;
create policy "Authenticated users can read locations"
on public.locations
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

-- La carga y edición se habilitarán con políticas de administrador/referente
-- cuando definamos el flujo de autenticación y permisos.

comment on table public.locations is 'Sites, plantas, campos y ubicaciones asociadas para el mapa y la gestión de visitas.';
comment on table public.profiles is 'Perfil de aplicación asociado a un usuario autenticado de Supabase.';
comment on column public.locations.source_id is 'ID_Lugar del Excel Ubicaciones_Bayer.xlsx.';
comment on column public.locations.site_referent_user_id is 'Referente que debe aprobar visitas a esta instalación.';
comment on column public.profiles.favorite_companion_id is 'Usuario elegido como compañero favorito.';
