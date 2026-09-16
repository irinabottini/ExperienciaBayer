-- Experiencia Bayer: estados visibles para eventos.
-- Ejecutar despues de 008_create_calendario_eventos.sql.

alter table public.eventos
drop constraint if exists eventos_estado_check;

alter table public.eventos
add constraint eventos_estado_check
check (estado in ('Pendiente', 'Activo', 'Finalizado', 'Cancelado'));

update public.eventos
set estado = 'Pendiente'
where estado = 'Borrador';

update public.eventos
set estado = 'Activo'
where estado = 'Publicado';

update public.eventos
set estado = 'Finalizado'
where estado = 'Cerrado';
