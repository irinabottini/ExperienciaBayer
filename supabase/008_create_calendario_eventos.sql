-- Experiencia Bayer: eventos normalizados para la agenda global.
-- Ejecutar despues de 002_create_usuarios.sql y 003_create_ubicaciones.sql.

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  instalacion_id uuid not null references public.ubicaciones(id) on delete restrict,
  creador_usuario_id uuid references public.usuarios(id) on delete set null,
  creador_email text,
  tipo_experiencia text not null,
  asunto text not null,
  tema text,
  objetivo text,
  inicio timestamptz not null,
  fin timestamptz not null,
  invitados integer check (invitados is null or invitados > 0),
  estado text not null default 'Borrador' check (estado in ('Borrador', 'Publicado', 'Cancelado', 'Cerrado')),
  datos jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint eventos_fecha_valida check (fin > inicio)
);

create index if not exists eventos_instalacion_inicio_idx
  on public.eventos (instalacion_id, inicio);

create index if not exists eventos_inicio_idx
  on public.eventos (inicio);

create or replace function public.set_eventos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists eventos_set_updated_at on public.eventos;
create trigger eventos_set_updated_at
before update on public.eventos
for each row execute function public.set_eventos_updated_at();

alter table public.eventos enable row level security;

drop policy if exists "Authenticated users can read eventos" on public.eventos;
create policy "Authenticated users can read eventos"
on public.eventos
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can create eventos" on public.eventos;
create policy "Authenticated users can create eventos"
on public.eventos
for insert
to authenticated
with check (true);

drop policy if exists "Owners and admins can update eventos" on public.eventos;
create policy "Owners and admins can update eventos"
on public.eventos
for update
to authenticated
using (
  creador_usuario_id = (select id from public.usuarios where auth_user_id = auth.uid())
  or public.current_app_role() in ('Administrador', 'Organizador')
)
with check (
  creador_usuario_id = (select id from public.usuarios where auth_user_id = auth.uid())
  or public.current_app_role() in ('Administrador', 'Organizador')
);

comment on column public.eventos.instalacion_id is 'Instalacion donde se realiza el evento; permite filtrar el calendario global.';
comment on column public.eventos.asunto is 'Asunto visible en la agenda.';
comment on column public.eventos.tema is 'Tema o eje principal visible en la agenda.';
comment on column public.eventos.inicio is 'Fecha y hora de inicio del evento.';
comment on column public.eventos.fin is 'Fecha y hora de finalizacion del evento.';