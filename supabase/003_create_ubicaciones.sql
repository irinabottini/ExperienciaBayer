-- Experiencia Bayer: tabla de ubicaciones
-- Ejecutar después de 002_create_usuarios.sql.
-- source_id corresponde a ID_Lugar del archivo Ubicaciones_Bayer.xlsx.

create extension if not exists pgcrypto;

create table if not exists public.ubicaciones (
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
  site_referent_user_id uuid references public.usuarios(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ubicaciones_name_unique unique (name)
);

alter table public.usuarios
  drop constraint if exists usuarios_primary_location_id_fkey;

alter table public.usuarios
  add constraint usuarios_primary_location_id_fkey
  foreign key (primary_location_id)
  references public.ubicaciones(id)
  on delete set null;

-- Fila modelo inicial. Luego se reemplaza por los registros del Excel.
insert into public.ubicaciones (
  source_id,
  entity,
  name,
  location_type,
  main_activity,
  published_address,
  locality,
  province,
  latitude,
  longitude,
  coordinate_quality,
  notes,
  status,
  site_referent_user_id
)
values (
  0,
  'AgroBayer',
  'Ubicacion Modelo',
  'Site de prueba',
  'Registro inicial para validar la tabla y el mapa',
  'Direccion pendiente',
  'Localidad pendiente',
  'Provincia pendiente',
  -34.603722,
  -58.381592,
  'Modelo',
  'Fila creada para validar la estructura antes de cargar el listado real.',
  'Pendiente',
  '00000000-0000-0000-0000-000000000001'
)
on conflict (source_id) do nothing;

create index if not exists ubicaciones_coordinates_idx
  on public.ubicaciones (latitude, longitude);

create index if not exists ubicaciones_referent_idx
  on public.ubicaciones (site_referent_user_id);

create or replace function public.set_ubicaciones_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ubicaciones_set_updated_at on public.ubicaciones;
create trigger ubicaciones_set_updated_at
before update on public.ubicaciones
for each row execute function public.set_ubicaciones_updated_at();

alter table public.ubicaciones enable row level security;

drop policy if exists "Authenticated users can read ubicaciones" on public.ubicaciones;
create policy "Authenticated users can read ubicaciones"
on public.ubicaciones
for select
to authenticated
using (true);

comment on table public.ubicaciones is 'Sites, plantas, campos y ubicaciones asociadas para el mapa y las visitas.';
comment on column public.ubicaciones.source_id is 'ID_Lugar del Excel Ubicaciones_Bayer.xlsx.';
comment on column public.ubicaciones.site_referent_user_id is 'Usuario referente responsable de aprobar visitas a esta ubicación.';
