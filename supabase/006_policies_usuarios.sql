-- Experiencia Bayer: permisos de lectura y edición de usuarios
-- Ejecutar después de 005_seed_usuarios_excel.sql.
-- Requiere que los usuarios reales estén vinculados con auth.users mediante auth_user_id.

-- Lectura temporal para que el acceso por CWID demo pueda consultar usuarios.
-- Cuando activemos login real, se puede cambiar anon por authenticated.
drop policy if exists "Public can read usuarios" on public.usuarios;
create policy "Public can read usuarios"
on public.usuarios
for select
to anon, authenticated
using (true);

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.usuarios
  where auth_user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to anon, authenticated;

drop policy if exists "Users can update own profile" on public.usuarios;
create policy "Users can update own profile"
on public.usuarios
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "Admins and organizers can update users" on public.usuarios;
create policy "Admins and organizers can update users"
on public.usuarios
for update
to authenticated
using (public.current_app_role() in ('Administrador', 'Organizador'))
with check (public.current_app_role() in ('Administrador', 'Organizador'));

drop policy if exists "Admins and organizers can insert users" on public.usuarios;
create policy "Admins and organizers can insert users"
on public.usuarios
for insert
to authenticated
with check (public.current_app_role() in ('Administrador', 'Organizador'));

comment on policy "Public can read usuarios" on public.usuarios is 'Lectura temporal para el acceso demo por CWID; retirar cuando exista login Auth.';
