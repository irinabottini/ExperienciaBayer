-- Experiencia Bayer: tabla de usuarios de la aplicación
-- Ejecutar primero en Supabase SQL Editor.
-- La autenticación queda a cargo de Supabase Auth.
-- auth_user_id se completa cuando creemos los usuarios reales en Authentication.

create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  cwid text unique,
  full_name text not null,
  email text not null unique,
  role text not null default 'Visita' check (role in (
    'Administrador',
    'Lider',
    'Referente del site',
    'Referente por equipo',
    'Organizador',
    'Visita'
  )),
  source_role text,
  team text,
  area text,
  job_function text,
  squad text,
  ceco text,
  major_account text,
  phone text,
  clothing_size text,
  dietary_condition text,
  favorite_companion_id uuid references public.usuarios(id) on delete set null,
  primary_location_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fila modelo inicial. Se puede editar o eliminar después.
insert into public.usuarios (
  id,
  full_name,
  email,
  role,
  team,
  area,
  phone,
  clothing_size,
  dietary_condition
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Usuario Modelo',
  'usuario.modelo@bayer.com',
  'Administrador',
  'Comunicacion',
  'Comunicaciones',
  '+54 9 11 0000-0000',
  'M',
  'No informado'
)
on conflict (id) do nothing;

create index if not exists usuarios_email_idx on public.usuarios (lower(email));
create index if not exists usuarios_role_idx on public.usuarios (role);

create or replace function public.set_usuarios_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists usuarios_set_updated_at on public.usuarios;
create trigger usuarios_set_updated_at
before update on public.usuarios
for each row execute function public.set_usuarios_updated_at();

alter table public.usuarios enable row level security;

drop policy if exists "Authenticated users can read usuarios" on public.usuarios;
create policy "Authenticated users can read usuarios"
on public.usuarios
for select
to authenticated
using (true);

comment on table public.usuarios is 'Usuarios y perfiles operativos de Experiencia Bayer.';
comment on column public.usuarios.auth_user_id is 'Usuario correspondiente en Supabase Authentication.';
comment on column public.usuarios.favorite_companion_id is 'Otro usuario elegido como compañero favorito.';
