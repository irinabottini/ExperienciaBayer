-- Experiencia Bayer: corregir permisos del modo demo para public.eventos.
-- Ejecutar despues de 008_create_calendario_eventos.sql y 009_policies_eventos_demo.sql.
-- Estas politicas son temporales mientras el acceso use CWID demo sin Supabase Auth.

grant select, insert, update on table public.eventos to anon;

drop policy if exists "Demo users can read eventos" on public.eventos;
create policy "Demo users can read eventos"
on public.eventos for select to anon using (true);

drop policy if exists "Demo users can create eventos" on public.eventos;
create policy "Demo users can create eventos"
on public.eventos for insert to anon with check (true);

drop policy if exists "Demo users can update eventos" on public.eventos;
create policy "Demo users can update eventos"
on public.eventos for update to anon using (true) with check (true);
