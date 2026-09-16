-- Experiencia Bayer: espacios disponibles dentro de cada instalacion.
-- La tabla es general: cada nueva ubicacion puede tener sus propios espacios.
-- Ejecutar despues de 003_create_ubicaciones.sql.

create table if not exists public.ubicacion_espacios (
  id uuid primary key default gen_random_uuid(),
  ubicacion_id uuid not null references public.ubicaciones(id) on delete cascade,
  nombre text not null,
  capacidad_personas integer check (capacidad_personas is null or capacidad_personas > 0),
  equipamiento text,
  ubicacion_exacta text,
  tipo text,
  estado text not null default 'Disponible' check (estado in ('Disponible', 'No disponible', 'En mantenimiento')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ubicacion_espacios_nombre_unique unique (ubicacion_id, nombre)
);

create index if not exists ubicacion_espacios_ubicacion_idx
  on public.ubicacion_espacios (ubicacion_id);

create or replace function public.set_ubicacion_espacios_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ubicacion_espacios_set_updated_at on public.ubicacion_espacios;
create trigger ubicacion_espacios_set_updated_at
before update on public.ubicacion_espacios
for each row execute function public.set_ubicacion_espacios_updated_at();

alter table public.ubicacion_espacios enable row level security;

drop policy if exists "Authenticated users can read ubicacion espacios" on public.ubicacion_espacios;
create policy "Authenticated users can read ubicacion espacios"
on public.ubicacion_espacios
for select
to authenticated
using (true);

drop policy if exists "Admins and organizers can manage ubicacion espacios" on public.ubicacion_espacios;
create policy "Admins and organizers can manage ubicacion espacios"
on public.ubicacion_espacios
for all
to authenticated
using (public.current_app_role() in ('Administrador', 'Organizador'))
with check (public.current_app_role() in ('Administrador', 'Organizador'));

-- Carga inicial del Campus Bayer. Se vincula por nombre para que la migracion
-- siga siendo repetible y no dependa de un UUID fijo.
insert into public.ubicacion_espacios (
  ubicacion_id,
  nombre,
  capacidad_personas,
  equipamiento,
  ubicacion_exacta,
  tipo,
  notas
)
select
  ubicacion.id,
  espacio.nombre,
  espacio.capacidad_personas,
  espacio.equipamiento,
  espacio.ubicacion_exacta,
  espacio.tipo,
  espacio.notas
from public.ubicaciones as ubicacion
cross join (
  values
    ('Espacio a campo', null::integer, 'Apoyo logistico y audio segun la actividad', 'Area abierta de ensayos', 'Exterior', 'Recorridas tecnicas y demostraciones en condiciones reales de cultivo.'),
    ('Domo', null::integer, 'Livings y sectores de descanso', 'Area de encuentro al aire libre', 'Exterior', 'Pausas e intercambio en contacto con la naturaleza.'),
    ('Salita', 20, 'Mobiliario para reuniones', 'Edificio principal', 'Interior', 'Sala para grupos reducidos.'),
    ('Preceoneta', 40, 'Unidad movil y apoyo audiovisual', 'Sector exterior del Campus', 'Movil', 'Espacio movil para actividades y demostraciones.'),
    ('Auditorio', 90, 'Audio, proyeccion y mobiliario de auditorio', 'Edificio principal', 'Interior', 'Capacitaciones y encuentros de hasta 90 personas.'),
    ('Espacio de almuerzo al aire libre', null::integer, 'Mesas y apoyo de servicio de comida', 'Sector exterior del Campus', 'Exterior', 'Almuerzos y comidas al aire libre.'),
    ('Sin espacio definido', null::integer, null, null, 'Virtual', 'Usar cuando el espacio se definira mas adelante.')
) as espacio(nombre, capacidad_personas, equipamiento, ubicacion_exacta, tipo, notas)
where ubicacion.name = 'Campus Bayer'
on conflict (ubicacion_id, nombre) do update set
  capacidad_personas = excluded.capacidad_personas,
  equipamiento = excluded.equipamiento,
  ubicacion_exacta = excluded.ubicacion_exacta,
  tipo = excluded.tipo,
  notas = excluded.notas,
  updated_at = now();

comment on table public.ubicacion_espacios is 'Espacios y equipamiento disponibles dentro de cada instalacion.';
comment on column public.ubicacion_espacios.ubicacion_id is 'Instalacion o site al que pertenece el espacio.';
comment on column public.ubicacion_espacios.ubicacion_exacta is 'Referencia de ubicacion dentro de la instalacion.';