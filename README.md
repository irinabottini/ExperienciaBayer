# Experiencia Bayer

MVP inicial del portal para gestionar la experiencia de eventos en los sites de Argentina.

## Modulos iniciales

- Inicio: bienvenida y explicacion del flujo de uso.
- Mi Perfil: datos de usuario (actualmente mock, luego Supabase).
- Ubicaciones: listado de sites con datos base.
- Quiero Organizar Mi Evento: formulario de carga de evento.
- Eventos Creados: visualizacion y acciones iniciales (editar / disparar mail).
- Calendario Global: filtro por ubicacion para ver eventos.

## Estado actual

- Frontend inicial en HTML, CSS y JavaScript.
- Persistencia temporal en LocalStorage para los eventos.
- Listo para migrar a Supabase en la siguiente etapa.

## Siguiente etapa sugerida

1. Crear tablas en Supabase (`profiles`, `locations`, `events`, `event_guests`).
2. Reemplazar datos mock por consultas reales.
3. Implementar autenticacion y permisos.
4. Habilitar edicion completa y envio de mails.
