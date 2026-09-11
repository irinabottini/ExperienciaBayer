-- Experiencia Bayer: migracion y carga de usuarios desde Base de datos - Usuarios CAMPUS Bayer.xlsx
-- Ejecutar despues de 002_create_usuarios.sql.
-- La carga es repetible: actualiza por email y no duplica registros.

alter table public.usuarios add column if not exists cwid text;
alter table public.usuarios add column if not exists source_role text;
alter table public.usuarios add column if not exists job_function text;
alter table public.usuarios add column if not exists squad text;
alter table public.usuarios add column if not exists ceco text;
alter table public.usuarios add column if not exists major_account text;

create unique index if not exists usuarios_cwid_unique_idx on public.usuarios (cwid) where cwid is not null;
create unique index if not exists usuarios_email_unique_idx on public.usuarios (email);

alter table public.usuarios drop constraint if exists usuarios_role_check;
alter table public.usuarios add constraint usuarios_role_check check (role in ('Administrador', 'Lider', 'Referente del site', 'Referente por equipo', 'Organizador', 'Visita'));

insert into public.usuarios (
  cwid, full_name, email, role, source_role, job_function, squad, ceco, major_account, phone
) values
  ('GMERQ', 'Irina Bottini', 'irina.bottini@bayer.com', 'Administrador', 'Administrador', 'Data Analyst', 'Product Team', 'ARG72102', NULL, '2477-232120'),
  ('UAFEQ', 'Carla Serre', 'carla.serre@bayer.com', 'Administrador', 'Administrador', 'University Traineeship', 'Product Team', 'ARG72102', NULL, '2364-555222'),
  (NULL, 'Ignacio Massigoge', 'ignacio.massigoge@bayer.com', 'Referente por equipo', 'Equipo', 'Cropping System Specialist', 'Product Team', 'ARG72102', NULL, '2494-313733'),
  ('LNGARCI', 'Lorena García', 'lorena.garcia@bayer.com', 'Referente por equipo', 'Equipo', 'Knowledge Transfer Strategy Special', 'Product Team', 'ARG72102', NULL, '2477-531084'),
  ('GZAMORA', 'Guillermo Zamora', 'guillermo.zamora@bayer.com', 'Referente por equipo', 'Equipo', 'Product & System Specialist', 'Product Team', 'ARG72102', NULL, '3492-526171'),
  ('NPERA', 'Nahuel Peralta', 'nahuelraul.peralta@bayer.com', 'Organizador', 'Organizador', 'Licensing Product Manager', 'Product Team', 'ARG72102', NULL, '2477-689393'),
  ('GNGJB', 'Paula Giron', 'paula.giron@bayer.com', 'Organizador', 'Organizador', 'Corn Technical Manager', 'Product Team', 'ARG72102', NULL, '3388-415053'),
  ('MMORR1', 'Marcelo Morris', 'marcelo.morris@bayer.com', 'Organizador', 'Organizador', 'HER & INS Technical Manager', 'Product Team', 'ARG72102', NULL, '1126414710'),
  ('MBORG3', 'Maria Leticia Borghi', 'marialeticia.borghi@bayer.com', 'Organizador', 'Organizador', 'FUN, SGR & BLX Product Manager', 'Product Team', 'ARG72102', NULL, '3585171587'),
  ('TKIRT', 'Tomás Kirton', 'tomas.kirton@bayer.com', 'Organizador', 'Organizador', 'DK & LT Product Manager CNS', 'Product Team', 'ARG72102', NULL, '3412136369'),
  ('BRWZK', 'Jorge Alberto Barrionuevo', 'jorge.barrionuevo@bayer.com', 'Organizador', 'Organizador', 'Portfolio Management', 'Product Team', 'ARG72102', NULL, '1140789890'),
  ('DROSA2', 'Rosario Decia', 'rosario.decia@bayer.com', 'Organizador', 'Organizador', 'STA Product Strategy Support', 'Product Team', 'ARG72102', NULL, '1165192727'),
  ('CCSOFE', 'Carolina Sofer Podesta', 'carolina.soferpodesta@bayer.com', 'Organizador', 'Organizador', 'Licensing Product Manager', 'Product Team', 'ARG72102', NULL, '1165481914'),
  ('MNCUETO', 'Maximiliano Cueto', 'maximiliano.cueto@bayer.com', 'Organizador', 'Organizador', 'Product Portfolio Management Lead', 'Product Team', 'ARG72102', NULL, '2396620703'),
  ('GPQBK', 'Martín Parco', 'martin.parco@bayer.com', 'Organizador', 'Organizador', 'Carbon Tech & Models', 'Carbon Venture', NULL, NULL, '1160121746'),
  ('MNAVA2', 'Martin Navarro', 'martin.navarro@bayer.com', 'Organizador', 'Organizador', 'DFS Science Lead for Latam', 'New Dgital Value Solutions', 'ARG72027', NULL, '2477666501'),
  ('LLSALG', 'Lucrecia Salgado', 'lucrecia.salgado@bayer.com', 'Organizador', 'Organizador', 'Agronomic Specialist', 'New Dgital Value Solutions', 'ARG72027', NULL, NULL),
  ('EKLTC', 'Luis Branda', 'luis.branda@bayer.com', 'Organizador', 'Organizador', 'Integrated Value Proposal Specialist', 'New Dgital Value Solutions', 'ARG72027', NULL, NULL),
  ('FAZCU', 'Federico Azcune', 'federico.azcune@bayer.com', 'Organizador', 'Organizador', 'Market Development Representative', 'AG Services Conosur', 'ARG73703', NULL, '2477685662'),
  ('JALOTA', 'Javier Lotano', 'javier.lotano@bayer.com', 'Organizador', 'Organizador', 'Field Operational Excellence', 'AG Services Conosur', 'ARG73703', NULL, NULL),
  ('SROJA', 'Silvina Rojas', 'silvinalujan.rojas@bayer.com', 'Organizador', 'Organizador', 'Agronomic Services Operations Conosur', 'AG Services Conosur', 'ARG73703', NULL, NULL),
  ('JBLANC3', 'Juan Manuel Blanco', 'juanmanuel.blanco@bayer.com', 'Organizador', 'Organizador', 'Field Testing Representative', 'AG Services Conosur', 'ARG73703', NULL, NULL),
  ('GLETZ', 'Luciano Colombatti', 'lucianofrancisco.colombatti@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S10-CENTRO', 'ARG72138', NULL, NULL),
  ('ARAGE', 'AndreaFabiana Guerrero', 'andrea.guerrero@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S4-ESTE', 'ARG76078', NULL, NULL),
  ('DBORE', 'DarioAndres Boretto', 'darioandres.boretto@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S11-CORDOBA ESTE', 'ARG72138', NULL, NULL),
  (NULL, 'Dario Oleszczuk', 'dario.oleszczuk@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S3-NEA', 'ARG72524', NULL, NULL),
  ('DSTIB', 'DesireeAnalis Stibel', 'desireeanalis.stibel@bayer.com', 'Organizador', 'Ventas', 'RV', 'S15-EXIMIA SUR', 'ARG72199', NULL, NULL),
  ('FGPOSS', 'Federico GranilloPosse', 'federico.granilloposse@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S6-NUCLEO NORTE', 'ARG72401', NULL, NULL),
  (NULL, 'FedericoEduardo Lopez', 'federicoeduardo.lopez@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S6-NUCLEO NORTE', 'ARG72509', NULL, NULL),
  ('GLNQJ', 'GermanEnrique Torrallardona', 'germanenrique.torrallardona@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S8-OESTE', 'ARG72501', NULL, NULL),
  ('GDCJC', 'JoseGervasio Varesini', 'josegervasio.varesini@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S8-OESTE', 'ARG72501', NULL, NULL),
  ('GHVMM', 'HernanGustavo MiserezFlesia', 'hernan.miserez@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S4-ESTE', 'ARG76078', NULL, NULL),
  ('JJPUCC', 'Javier Pucciarelli', 'javier.pucciarelli@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S15-EXIMIA SUR', 'ARG72199', NULL, NULL),
  ('GMJPK', 'Joaquin GomezOlmedo', 'joaquin.gomezolmedo@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S6-NUCLEO NORTE', 'ARG72509', NULL, NULL),
  ('JJLEIV', 'Jose Leiva', 'jose.leiva@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S7-NUCLEO SUR', 'ARG732035', NULL, NULL),
  (NULL, 'Lisando Martino', 'lisandroluis.martino@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S14-EXIMIA MEGA', 'ARG72521', NULL, NULL),
  ('MVENT', 'Marcelo Ventura', 'marcelo.ventura@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S12-RIO IV & SAN LUIS', 'ARG72011', NULL, NULL),
  ('MREPI', 'Marcos Repiso', 'marcos.repiso@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S13-EXIMIA NORTE', 'ARG72107', NULL, NULL),
  ('EKRZG', 'Marcos Vaschalde', 'marcos.vaschalde@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S14-EXIMIA MEGA', NULL, NULL, NULL),
  ('MROBL', 'Mariana Robles', 'mariana.robles@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S9-SUR', 'ARG72901', NULL, NULL),
  ('GNWWC', 'MicaelaAnahi Guzowski', 'micaelaanahi.guzowski@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S3-NEA', 'ARG72524', NULL, NULL),
  ('GNLCH', 'NadiaMariaBelen Cancelarich', 'nadiamariabelen.cancelarich@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S3-NEA', 'ARG72524', NULL, NULL),
  ('EHDBZ', 'Nicolas Linari', 'nicolas.linari@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S7-NUCLEO SUR', NULL, NULL, NULL),
  ('GPLOF', 'Nicolas Scandolo', 'nicolas.scandolo@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S12-RIO IV & SAN LUIS', NULL, NULL, NULL),
  ('ORODR', 'Oscar Rodriguez', 'oscar.rodriguez1@bayer.com', 'Organizador', 'Ventas', NULL, NULL, 'UR09MC2000', NULL, NULL),
  ('ARAPV', 'Roberto Garcia', 'roberto.garcia@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S1-NOA', 'ARG72504', NULL, NULL),
  ('RRGUTI4', 'Rodrigo Gutierrez', 'rodrigo.gutierrez@bayer.com', 'Organizador', 'Ventas', 'Activador comercial', 'S16-SE', 'ARG72401', NULL, NULL),
  ('EFELG', 'Santiago Bringas', 'santiago.bringas@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S1-NOA', NULL, NULL, NULL),
  ('SRUIZ', 'Sebastian Ruiz', 'sebastian.ruiz@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S1-NOA', 'ARG72504', NULL, NULL),
  ('ELBNE', 'Tomás GómezBorelli', 'tomas.gomezborelli@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S13-EXIMIA NORTE', 'ARG72107', NULL, NULL),
  ('GPZVH', 'Francisco Bruna', 'francisco.bruna@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S10-CENTRO', NULL, NULL, NULL),
  ('GEITE', 'JuanPablo Boiero', 'juanpablo.boiero@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S11-CORDOBA ESTE', 'ARG72100', NULL, NULL),
  ('GFKVN', 'Santiago Aprile', 'santiago.aprile@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S7-NUCLEO SUR', 'ARG72035', NULL, NULL),
  ('GOIHX', 'Sol Arroquy', 'sol.arroquy@bayer.com', 'Organizador', 'Ventas', 'Consultor técnico', 'S9-SUR', 'ARG72901', NULL, NULL)
on conflict (email) do update set
  cwid = excluded.cwid,
  full_name = excluded.full_name,
  role = excluded.role,
  source_role = excluded.source_role,
  job_function = excluded.job_function,
  squad = excluded.squad,
  ceco = excluded.ceco,
  major_account = excluded.major_account,
  phone = excluded.phone;

-- Verificacion: debe devolver 54 usuarios cargados desde el Excel.
select count(*) as total_usuarios_excel
from public.usuarios
where email like '%@bayer.com';
