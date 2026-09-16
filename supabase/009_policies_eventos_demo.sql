-- Experiencia Bayer: permisos temporales para el modo demo por CWID.
-- Ejecutar despues de 008_create_calendario_eventos.sql.
-- IMPORTANTE: retirar estas politicas cuando el login use Supabase Auth real.

 drop policy if exists "Demo users can read eventos" on public.eventos;
create policy "Demo users can read eventos"
on public.eventos
for select
to anon
using (true);

drop policy if exists "Demo users can create eventos" on public.eventos;
create policy "Demo users can create eventos"
on public.eventos
for insert
to anon
with check (true);

drop policy if exists "Demo users can update eventos" on public.eventos;
create policy "Demo users can update eventos"
on public.eventos
for update
to anon
using (true)
with check (true);

comment on table public.eventos is 'Eventos de Experiencia Bayer. Las politicas anon son temporales para el acceso demo por CWID.';
