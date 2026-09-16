const STORAGE_KEY_EVENTS = "experiencia-bayer-events";
const accessScreen = document.getElementById("access-screen");
const appShell = document.getElementById("app-shell");
const loginForm = document.getElementById("login-form");
const cwidInput = document.getElementById("cwid-input");
const loginMessage = document.getElementById("login-message");
const requestUserButton = document.getElementById("request-user-btn");
const requestUserMessage = document.getElementById("request-user-message");
const editOwnProfileButton = document.getElementById("edit-own-profile-btn");
const ownProfileForm = document.getElementById("own-profile-form");
const ownProfileMessage = document.getElementById("own-profile-message");
const adminUserTools = document.getElementById("admin-user-tools");
const newUserForm = document.getElementById("new-user-form");
const newUserMessage = document.getElementById("new-user-message");
const adminEditUserForm = document.getElementById("admin-edit-user-form");
const adminEditUserMessage = document.getElementById("admin-edit-user-message");
const rolePermissions = {
  Administrador: "Acceso completo a perfiles, usuarios, ubicaciones y eventos.",
  Lider: "Visualiza toda la operación, sin modificar eventos ni usuarios.",
  "Referente del site": "Administra su instalación y valida visitas a su site.",
  "Referente por equipo": "Edita eventos propios y de su equipo.",
  Organizador: "Crea y edita eventos, y puede gestionar usuarios.",
  Visita: "Solo consulta la información habilitada."
};

const ROLES = {
  ADMIN: "Administrador",
  LIDER: "Lider",
  SITE_REF: "Referente del site",
  TEAM_REF: "Referente por equipo",
  ORG: "Organizador",
  VISITA: "Visita"
};

const users = [
  {
    id: "u1",
    cwid: "GMERQ",
    name: "Irina Bottini",
    email: "irina@bayer.com",
    role: ROLES.ADMIN,
    siteId: "campus-bayer",
    team: "Comunicacion",
    area: "Comunicaciones",
    phone: "+54 9 11 1111-1111",
    talle: "M",
    condicionAlimenticia: "Omnivora",
    companeroFavorito: "Carlos Ejemplo"
  },
  {
    id: "u2",
    name: "Carlos Ejemplo",
    email: "carlos.ce@bayer.com",
    role: ROLES.LIDER,
    siteId: "zarate-i",
    team: "CE",
    area: "Direccion",
    phone: "+54 9 11 2222-2222",
    talle: "L",
    condicionAlimenticia: "No informado",
    companeroFavorito: "No informado"
  },
  {
    id: "u3",
    name: "Laura Site",
    email: "laura.site@bayer.com",
    role: ROLES.SITE_REF,
    siteId: "campus-bayer",
    team: "Operaciones",
    area: "Site Management",
    phone: "+54 9 11 3333-3333",
    talle: "M",
    condicionAlimenticia: "Vegetariana",
    companeroFavorito: "No informado"
  },
  {
    id: "u4",
    name: "Martin Equipo",
    email: "martin.equipo@bayer.com",
    role: ROLES.TEAM_REF,
    siteId: "campus-bayer",
    team: "Marketing",
    area: "Comercial",
    phone: "+54 9 11 4444-4444",
    talle: "S",
    condicionAlimenticia: "No informado",
    companeroFavorito: "No informado"
  },
  {
    id: "u5",
    name: "Sofia Organiza",
    email: "sofia.organiza@bayer.com",
    role: ROLES.ORG,
    siteId: "campus-bayer",
    team: "Marketing",
    area: "Comercial",
    phone: "+54 9 11 5555-5555",
    talle: "M",
    condicionAlimenticia: "No informado",
    companeroFavorito: "No informado"
  },
  {
    id: "u6",
    name: "Invitado Externo",
    email: "visita@externo.com",
    role: ROLES.VISITA,
    siteId: "zarate",
    team: "Visitante",
    area: "N/A",
    phone: "N/A",
    talle: "No informado",
    condicionAlimenticia: "No informado",
    companeroFavorito: "No informado"
  }
];

let activeUserId = users[0].id;

function normalizeCwid(value) {
  return value.trim().toUpperCase();
}

async function findUserByCwid(cwid) {
  if (window.supabaseClient) {
    const { data, error } = await window.supabaseClient
      .from("usuarios")
      .select("id, cwid, full_name, email, role, primary_location_id, team, area, phone, clothing_size, dietary_condition")
      .eq("cwid", cwid)
      .maybeSingle();

    if (error) {
      return { error: `Supabase no pudo consultar public.usuarios: ${error.message}` };
    }

    if (data) {
      return {
        id: data.id,
        cwid: data.cwid,
        name: data.full_name,
        email: data.email,
        role: data.role,
        siteId: data.primary_location_id,
        team: data.team ?? "No informado",
        area: data.area ?? "No informado",
        phone: data.phone ?? "No informado",
        talle: data.clothing_size ?? "No informado",
        condicionAlimenticia: data.dietary_condition ?? "No informado",
        companeroFavorito: "No informado"
      };
    }
  }

  const localUser = users.find((user) => user.cwid === cwid);
  return localUser ?? { error: "Supabase no esta disponible y no hay un usuario demo para este CWID." };
}

function enterApp(user) {
  activeUserId = user.id;
  if (!users.some((item) => item.id === user.id)) {
    users.push(user);
  }
  accessScreen.hidden = true;
  appShell.hidden = false;
  initializeApp();
}

let locations = [
  {
    id: "zarate-i",
    name: "Zarate I",
    province: "Buenos Aires",
    locality: "Zarate",
    capacity: 220,
    kind: "site",
    latitude: -34.075833,
    longitude: -59.057722,
    coordinateQuality: "Exacta publicada",
    managerEmail: "laura.site@bayer.com",
    notes: "Planta industrial"
  },
  {
    id: "zarate-ii",
    name: "Zarate II",
    province: "Buenos Aires",
    locality: "Zarate",
    capacity: 180,
    kind: "site",
    latitude: -34.101,
    longitude: -59.018,
    coordinateQuality: "Referencia aproximada",
    managerEmail: "carlos.ce@bayer.com",
    notes: "Planta industrial"
  },
  {
    id: "maria-eugenia",
    name: "Planta Maria Eugenia",
    province: "La Pampa",
    locality: "Rojas",
    capacity: 120,
    kind: "planta",
    latitude: -34.183,
    longitude: -60.707,
    coordinateQuality: "Referencia aproximada",
    managerEmail: "laura.site@bayer.com",
    notes: "Procesamiento de semillas de maiz"
  },
  {
    id: "fontezuela",
    name: "Estacion Experimental Fontezuela",
    province: "Buenos Aires",
    locality: "Fontezuela / Pergamino",
    capacity: 95,
    kind: "campo",
    latitude: -33.917,
    longitude: -60.467,
    coordinateQuality: "Referencia de localidad",
    managerEmail: "martin.equipo@bayer.com",
    notes: "I+D y campo experimental"
  },
  {
    id: "campus-bayer",
    name: "Campus Bayer",
    province: "Buenos Aires",
    locality: "Pergamino",
    capacity: 150,
    kind: "site",
    latitude: -33.8928,
    longitude: -60.5736,
    coordinateQuality: "Referencia de localidad",
    managerEmail: "martin.equipo@bayer.com",
    notes: "I+D, demostracion y capacitacion"
  },
  {
    id: "rio-cuarto",
    name: "Estacion de innovacion Rio Cuarto",
    province: "Cordoba",
    locality: "Rio Cuarto",
    capacity: 130,
    kind: "campo",
    latitude: -33.1232,
    longitude: -64.3493,
    coordinateQuality: "Referencia de localidad",
    managerEmail: "sofia.organiza@bayer.com",
    notes: "I+D y campo experimental"
  },
  {
    id: "breeding-tucuman",
    name: "Breeding Tucuman",
    province: "Tucuman",
    locality: "Tucuman",
    capacity: 95,
    kind: "campo",
    latitude: -26.826,
    longitude: -65.173,
    coordinateQuality: "Referencia aproximada",
    managerEmail: "laura.site@bayer.com",
    notes: "I+D y mejoramiento vegetal"
  },
  {
    id: "mendoza",
    name: "Centro de produccion de vegetales",
    province: "Mendoza",
    locality: "Mendoza",
    capacity: 120,
    kind: "planta",
    latitude: -32.8895,
    longitude: -68.8458,
    coordinateQuality: "Referencia provincial",
    managerEmail: "martin.equipo@bayer.com",
    notes: "Produccion de semillas de hortalizas"
  },
  {
    id: "agricola-testa",
    name: "Agricola Testa",
    province: "Buenos Aires",
    locality: "Pergamino",
    capacity: 95,
    kind: "campo",
    latitude: -33.8928,
    longitude: -60.5736,
    coordinateQuality: "Referencia de localidad",
    managerEmail: "sofia.organiza@bayer.com",
    notes: "Campo demostrativo asociado"
  },
  {
    id: "cropmix-prodeman",
    name: "Cropmix / Prodeman",
    province: "Cordoba",
    locality: "General Cabrera",
    capacity: 95,
    kind: "campo",
    latitude: -32.8137,
    longitude: -63.8736,
    coordinateQuality: "Referencia de localidad",
    managerEmail: "sofia.organiza@bayer.com",
    notes: "Campo demostrativo asociado"
  }
];

const locationKinds = {
  site: { label: "Site", icon: "◆" },
  oficina: { label: "Oficina", icon: "●" },
  campo: { label: "Campo", icon: "▲" },
  planta: { label: "Planta", icon: "■" }
};

const experienceLabels = {
  field_tour: "Bayer Field Tour",
  generacion: "Generacion de demanda",
  capacitacion: "Jornadas de capacitacion",
  licencias: "Licencias",
  eventos_bayer: "Eventos Bayer",
  visitas_site: "Visitas a site",
  internacionales: "Experiencias Internacionales"
};

const experienceDescriptions = {
  field_tour: "Encuentros con equipos internos que recorren distintos campos o localidades para visitar ensayos y conocer el trabajo en territorio.",
  generacion: "Encuentros con clientes en un unico lugar o en varias sedes, manteniendo el mismo grupo de participantes.",
  capacitacion: "Jornadas para equipos internos, consultores, representantes de venta y canal Innova, en uno o varios dias y con una sede fija o itinerante.",
  licencias: "Encuentros con personas externas que pertenecen a otras empresas.",
  eventos_bayer: "Encuentros multitudinarios de al menos 100 invitados, realizados en una instalacion principal, con participacion de internos, clientes, licenciatarios y publico diverso. Requieren coordinar servicios como hospedaje, comida, agencia, oradores, entretenimiento, sonido, iluminacion y espacios de conferencia.",
  visitas_site: "Encuentros con participantes internos y externos cuyo foco es conocer la instalacion y el funcionamiento de un site. El owner coordina el evento y el referente responsable de ese site debe aprobar la visita antes de recibir al grupo.",
  internacionales: "Jornadas destinadas a agroespecialistas premiados por su acompanamiento y contribucion al trabajo de Bayer."
};

let selectedExperience = null;

const menuButtons = document.querySelectorAll(".menu-btn");
const panels = document.querySelectorAll(".panel");
const profileNodes = {
  name: document.getElementById("profile-name"),
  email: document.getElementById("profile-email"),
  role: document.getElementById("profile-role"),
  site: document.getElementById("profile-site"),
  team: document.getElementById("profile-team"),
  area: document.getElementById("profile-area"),
  phone: document.getElementById("profile-phone"),
  talle: document.getElementById("profile-talle"),
  condicionAlimenticia: document.getElementById("profile-condicion-alimenticia"),
  companeroFavorito: document.getElementById("profile-companero-favorito"),
  permissions: document.getElementById("profile-permissions")
};

const locationsGrid = document.getElementById("locations-grid");
const eventForm = document.getElementById("event-form");
const eventLocationSelect = document.getElementById("event-location");
const trainingPrimaryLocationSelect = document.getElementById("training-primary-location");
const calendarLocationSelect = document.getElementById("calendar-location");
const formMessage = document.getElementById("form-message");
const eventsList = document.getElementById("events-list");
const calendarList = document.getElementById("calendar-list");
const profileSelector = document.getElementById("profile-selector");
const eventsScopeCopy = document.getElementById("events-scope-copy");
const usersList = document.getElementById("users-list");
const organizarAccessNote = document.getElementById("organizar-access-note");
const experienceNote = document.getElementById("experience-note");
const experienceConfig = document.getElementById("experience-config");
const trainingLogicBox = document.getElementById("training-logic");
const menuUsuarios = document.getElementById("menu-usuarios");
const experienceTypeButtons = document.querySelectorAll(".experience-type-btn");
const mapLegend = document.getElementById("map-legend");
const locationMap = window.L
  ? L.map("location-map").setView([-34.2, -62.5], 6)
  : null;
const locationMarkers = locationMap ? L.layerGroup().addTo(locationMap) : null;

if (locationMap) {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(locationMap);
}

function getActiveUser() {
  return users.find((user) => user.id === activeUserId) ?? users[0];
}

function mapLocationFromSupabase(row) {
  return {
    id: row.id,
    name: row.name,
    province: row.province ?? "Sin provincia",
    locality: row.locality ?? "Sin localidad",
    capacity: 0,
    kind: getLocationKindFromType(row.location_type),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    coordinateQuality: row.coordinate_quality ?? "Sin verificar",
    managerEmail: "Sin asignar",
    notes: row.notes ?? row.main_activity ?? "",
    entity: row.entity,
    status: row.status,
    address: row.published_address,
    googleMapsUrl: row.google_maps_url,
    siteReferentUserId: row.site_referent_user_id
  };
}

function getLocationKindFromType(type = "") {
  const normalizedType = type.toLowerCase();
  if (normalizedType.includes("planta")) {
    return "planta";
  }
  if (normalizedType.includes("campo") || normalizedType.includes("i+d")) {
    return "campo";
  }
  if (normalizedType.includes("oficina")) {
    return "oficina";
  }
  return "site";
}

async function loadLocationsFromSupabase() {
  if (!window.supabase || !window.supabaseClient) {
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("ubicaciones")
    .select("*")
    .order("source_id", { ascending: true });

  if (error) {
    console.warn("No se pudieron cargar las ubicaciones desde Supabase. Se usa el listado local.", error.message);
    return;
  }

  if (data?.length) {
    locations = data.map(mapLocationFromSupabase);
  }
}

function isAdminOrLeader(user) {
  return user.role === ROLES.ADMIN || user.role === ROLES.LIDER;
}

function canManageUsers(user) {
  return user.role === ROLES.ADMIN || user.role === ROLES.ORG;
}

function getSiteById(siteId) {
  return locations.find((location) => location.id === siteId);
}

function getRolePermissionText(user) {
  if (user.role === ROLES.ADMIN) {
    return "Puede ver y modificar todo";
  }
  if (user.role === ROLES.LIDER) {
    return "Puede ver todo, no modifica";
  }
  if (user.role === ROLES.SITE_REF) {
    return "Edita su site y sus eventos; visualiza eventos de otros en su site";
  }
  if (user.role === ROLES.TEAM_REF) {
    return "Edita eventos propios y de su equipo";
  }
  if (user.role === ROLES.ORG) {
    return "Edita solo eventos creados por si mismo";
  }
  return "Solo visualiza, sin acceso a organizar eventos";
}

function canCreateEvents(user) {
  return user.role !== ROLES.VISITA;
}

function canEditLocation(user, location) {
  if (user.role === ROLES.ADMIN) {
    return true;
  }

  return user.role === ROLES.SITE_REF && user.email === location.managerEmail;
}

function canEditEvent(user, event) {
  if (user.role === ROLES.ADMIN) {
    return true;
  }
  if (user.role === ROLES.LIDER) {
    return false;
  }
  if (user.role === ROLES.SITE_REF) {
    return event.ownerEmail === user.email;
  }
  if (user.role === ROLES.TEAM_REF) {
    const owner = users.find((item) => item.email === event.ownerEmail);
    return event.ownerEmail === user.email || (owner && owner.team === user.team);
  }
  if (user.role === ROLES.ORG) {
    return event.ownerEmail === user.email;
  }

  return false;
}

function canSeeEvent(user, event) {
  if (isAdminOrLeader(user)) {
    return true;
  }
  if (user.role === ROLES.SITE_REF) {
    const site = getSiteById(user.siteId);
    const owns = event.ownerEmail === user.email;
    const sameSite = event.location === site?.id;
    return owns || sameSite;
  }
  if (user.role === ROLES.TEAM_REF) {
    const owner = users.find((item) => item.email === event.ownerEmail);
    return event.ownerEmail === user.email || (owner && owner.team === user.team);
  }
  if (user.role === ROLES.ORG) {
    return event.ownerEmail === user.email;
  }

  return false;
}

function getEvents() {
  const data = localStorage.getItem(STORAGE_KEY_EVENTS);
  return data ? JSON.parse(data) : [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
}

function openPanel(panelName) {
  if (panelName === "usuarios" && !canManageUsers(getActiveUser())) {
    alert("Solo administradores y organizadores pueden gestionar Usuarios App.");
    return;
  }

  menuButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.panel === panelName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelName}`);
  });
}

function renderProfile() {
  const user = getActiveUser();
  profileNodes.name.textContent = user.name;
  profileNodes.email.textContent = user.email;
  profileNodes.role.textContent = user.role;
  profileNodes.site.textContent = getSiteById(user.siteId)?.name ?? "No asignado";
  profileNodes.team.textContent = user.team;
  profileNodes.area.textContent = user.area;
  profileNodes.phone.textContent = user.phone;
  profileNodes.talle.textContent = user.talle || "No informado";
  profileNodes.condicionAlimenticia.textContent = user.condicionAlimenticia || "No informado";
  profileNodes.companeroFavorito.textContent = user.companeroFavorito || "No informado";
  profileNodes.permissions.textContent = getRolePermissionText(user);
}

function renderLocations() {
  const user = getActiveUser();
  locationsGrid.innerHTML = "";
  if (!locationMap || !locationMarkers) {
    mapLegend.textContent = "El mapa no esta disponible en este momento.";
    return;
  }
  locationMarkers.clearLayers();

  locations.forEach((location) => {
    const card = document.createElement("article");
    card.className = "location-card";
    card.dataset.locationId = location.id;
    const editable = canEditLocation(user, location);
    const kind = locationKinds[location.kind] ?? { label: "Instalacion", icon: "•" };
    card.innerHTML = `
      <h4>${kind.icon} ${location.name}</h4>
      <p>${location.province}</p>
      <p><strong>Tipo:</strong> ${kind.label}</p>
      <p><strong>Coordenadas:</strong> ${location.latitude}, ${location.longitude}</p>
      <p><strong>Calidad:</strong> ${location.coordinateQuality}</p>
      <p>Capacidad estimada: ${location.capacity} personas</p>
      <p><strong>Responsable:</strong> ${location.managerEmail}</p>
      <p>${location.notes}</p>
      <p><strong>Permiso:</strong> ${editable ? "Puede editar" : "Solo lectura"}</p>
      <button class="action-btn" type="button" data-action="edit-site" data-id="${location.id}" ${editable ? "" : "disabled"}>
        Editar informacion del site
      </button>
    `;
    locationsGrid.appendChild(card);

    const marker = L.marker([location.latitude, location.longitude]);
    marker.bindPopup(`
      <strong>${location.name}</strong><br>
      ${location.locality}, ${location.province}<br>
      <small>${location.coordinateQuality}</small>
    `);
    marker.on("click", () => {
      const locationCard = locationsGrid.querySelector(`[data-location-id="${location.id}"]`);
      if (locationCard) {
        locationCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    locationMarkers.addLayer(marker);
  });

  renderMapLegend();
  setTimeout(() => locationMap.invalidateSize(), 0);
}

function renderMapLegend() {
  mapLegend.innerHTML = Object.values(locationKinds)
    .map(
      (kind) => `
      <span class="legend-item">
        <strong>${kind.icon}</strong>
        ${kind.label}
      </span>
    `
    )
    .join("");
}

function renderLocationOptions() {
  eventLocationSelect.innerHTML = "";
  trainingPrimaryLocationSelect.innerHTML = '<option value="">Elegir instalacion</option>';
  calendarLocationSelect.innerHTML = '<option value="all">Todos los sites</option>';

  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.id;
    option.textContent = `${location.name} (${location.province})`;

    eventLocationSelect.appendChild(option.cloneNode(true));
    trainingPrimaryLocationSelect.appendChild(option.cloneNode(true));
    calendarLocationSelect.appendChild(option);
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "Sin fecha";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getLocationName(locationId) {
  const location = getSiteById(locationId);
  return location ? location.name : "No definido";
}

function getEventsScopeCopy(user) {
  if (isAdminOrLeader(user)) {
    return "Ves todos los eventos. Administradores pueden editar; lideres solo visualizan.";
  }
  if (user.role === ROLES.SITE_REF) {
    return "Ves todos tus eventos editables y los creados por otros en tu site en modo lectura.";
  }
  if (user.role === ROLES.TEAM_REF) {
    return "Ves eventos propios y de personas de tu equipo; podes editarlos.";
  }
  if (user.role === ROLES.ORG) {
    return "Ves y editas solamente tus eventos.";
  }
  return "Modo visita: no hay eventos gestionables para este usuario.";
}

function renderEventsPanel() {
  const user = getActiveUser();
  const events = getEvents();
  eventsList.innerHTML = "";
  eventsScopeCopy.textContent = getEventsScopeCopy(user);

  const visibleEvents = events.filter((event) => canSeeEvent(user, event));

  if (visibleEvents.length === 0) {
    eventsList.innerHTML = '<div class="event-item"><p>Aun no hay eventos creados.</p></div>';
    return;
  }

  const sorted = [...visibleEvents].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((event) => {
    const editable = canEditEvent(user, event);
    const owner = users.find((item) => item.email === event.ownerEmail);
    const item = document.createElement("div");
    item.className = "event-item";
    item.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
      <p><strong>Lugar:</strong> ${getLocationName(event.location)}</p>
      <p><strong>Objetivo:</strong> ${event.objective}</p>
      <p><strong>Invitados:</strong> ${event.guests}</p>
      <p><strong>Experiencia:</strong> ${experienceLabels[event.experienceType] ?? "General"}</p>
      <p><strong>Creador:</strong> ${owner ? owner.name : event.ownerEmail}</p>
      <p><strong>Feedback:</strong> ${event.needsFeedback ? "Si" : "No"} | <strong>Assessment:</strong> ${event.needsAssessment ? "Si" : "No"}</p>
      <div class="event-actions">
        <button class="action-btn" type="button" data-action="edit" data-id="${event.id}" ${editable ? "" : "disabled"}>Editar</button>
        <button class="action-btn" type="button" data-action="mail" data-id="${event.id}">Disparar mail</button>
      </div>
    `;
    eventsList.appendChild(item);
  });
}

function renderCalendar() {
  const filter = calendarLocationSelect.value;
  const events = getEvents();
  const user = getActiveUser();

  calendarList.innerHTML = "";

  const filtered = events
    .filter((event) => canSeeEvent(user, event))
    .filter((event) => (filter === "all" ? true : event.location === filter))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (filtered.length === 0) {
    calendarList.innerHTML = '<div class="calendar-item"><p>No hay eventos para ese filtro.</p></div>';
    return;
  }

  filtered.forEach((event) => {
    const item = document.createElement("div");
    item.className = "calendar-item";
    item.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>${formatDate(event.date)}</strong> - ${getLocationName(event.location)}</p>
      <p>${experienceLabels[event.experienceType] ?? "General"}</p>
      <p>${event.guests} invitados</p>
    `;
    calendarList.appendChild(item);
  });
}

function renderUsersPanel() {
  const user = getActiveUser();
  if (!canManageUsers(user)) {
    usersList.innerHTML = '<div class="event-item"><p>No tenes permisos para visualizar usuarios.</p></div>';
    adminUserTools.hidden = true;
    return;
  }

  adminUserTools.hidden = false;

  usersList.innerHTML = users
    .map(
      (item) => `
      <div class="event-item user-admin-item" data-user-id="${item.id}">
        <h4>${item.name}</h4>
        <p><strong>CWID:</strong> ${item.cwid ?? "No informado"}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Rol:</strong> ${item.role}</p>
        <p><strong>Permisos:</strong> ${rolePermissions[item.role] ?? "No definido"}</p>
        <p><strong>Site:</strong> ${getLocationName(item.siteId)}</p>
        <p><strong>Equipo:</strong> ${item.team}</p>
        <button class="action-btn edit-user-btn" type="button" data-user-id="${item.id}">Editar usuario</button>
      </div>
    `
    )
    .join("");
}

function fillOwnProfileForm() {
  const user = getActiveUser();
  ownProfileForm.elements.full_name.value = user.name ?? "";
  ownProfileForm.elements.phone.value = user.phone ?? "";
  ownProfileForm.elements.clothing_size.value = user.talle ?? "";
  ownProfileForm.elements.dietary_condition.value = user.condicionAlimenticia ?? "";
  ownProfileForm.elements.favorite_companion.value = user.companeroFavorito ?? "";
}

async function updateUserInSupabase(userId, payload) {
  if (!window.supabaseClient) {
    return { error: new Error("Supabase no esta configurado.") };
  }

  const { data: authData } = await window.supabaseClient.auth.getUser();
  if (!authData?.user) {
    return { error: new Error("Necesitas iniciar sesion con Supabase Auth para guardar cambios.") };
  }

  const { data, error } = await window.supabaseClient
    .from("usuarios")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();

  return { data, error };
}

function applySupabaseUserData(user, data) {
  Object.assign(user, {
    name: data.full_name,
    email: data.email,
    role: data.role,
    siteId: data.primary_location_id,
    team: data.team,
    area: data.area,
    phone: data.phone,
    talle: data.clothing_size,
    condicionAlimenticia: data.dietary_condition
  });
}

function renderOrganizarAccess() {
  const user = getActiveUser();
  const allowed = canCreateEvents(user);
  const hasSelectedExperience = Boolean(selectedExperience);
  experienceConfig.hidden = !hasSelectedExperience;
  eventForm.style.display = allowed && hasSelectedExperience ? "grid" : "none";

  if (!hasSelectedExperience) {
    organizarAccessNote.textContent = "Selecciona un tipo de experiencia para comenzar a crear el evento.";
    experienceNote.textContent = "Cada tipo de experiencia muestra una configuracion distinta.";
    trainingLogicBox.hidden = true;
    return;
  }

  organizarAccessNote.textContent = allowed
    ? "Este modulo esta disponible para tu rol."
    : "Tu rol es Visita: no podes organizar eventos porque no tenes rol operativo en sistema.";

  experienceNote.textContent = `${experienceLabels[selectedExperience]}: ${experienceDescriptions[selectedExperience]}`;
  trainingLogicBox.hidden = selectedExperience !== "capacitacion";
}

function renderProfileSelector() {
  profileSelector.innerHTML = "";

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.name} - ${user.role}`;
    option.selected = user.id === activeUserId;
    profileSelector.appendChild(option);
  });
}

function renderMenuAccess() {
  menuUsuarios.hidden = !canManageUsers(getActiveUser());
}

function rerenderAll() {
  renderProfile();
  renderLocations();
  renderLocationOptions();
  renderEventsPanel();
  renderCalendar();
  renderUsersPanel();
  renderOrganizarAccess();
  renderMenuAccess();
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.dataset.panel);
  });
});

editOwnProfileButton.addEventListener("click", () => {
  fillOwnProfileForm();
  ownProfileForm.hidden = false;
});

ownProfileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getActiveUser();
  const formData = new FormData(ownProfileForm);
  const payload = {
    full_name: formData.get("full_name")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim() || null,
    clothing_size: formData.get("clothing_size")?.toString().trim() || null,
    dietary_condition: formData.get("dietary_condition")?.toString().trim() || null
  };
  ownProfileMessage.textContent = "Guardando perfil...";
  const { data, error } = await updateUserInSupabase(user.id, payload);
  if (error) {
    ownProfileMessage.textContent = error.message;
    return;
  }
  applySupabaseUserData(user, data);
  ownProfileMessage.textContent = "Perfil actualizado en Supabase.";
  renderProfile();
});

newUserForm.elements.role.innerHTML = Object.values(ROLES)
  .map((role) => `<option value="${role}">${role}</option>`)
  .join("");

newUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageUsers(getActiveUser())) {
    return;
  }
  const formData = new FormData(newUserForm);
  const payload = {
    cwid: formData.get("cwid")?.toString().trim().toUpperCase(),
    full_name: formData.get("full_name")?.toString().trim(),
    email: formData.get("email")?.toString().trim().toLowerCase(),
    role: formData.get("role")?.toString()
  };
  newUserMessage.textContent = "Guardando usuario...";
  if (!window.supabaseClient) {
    newUserMessage.textContent = "Supabase no esta configurado.";
    return;
  }
  const { data, error } = await window.supabaseClient
    .from("usuarios")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    newUserMessage.textContent = error.message;
    return;
  }
  users.push({
    id: data.id,
    cwid: data.cwid,
    name: data.full_name,
    email: data.email,
    role: data.role,
    siteId: data.primary_location_id,
    team: data.team,
    area: data.area,
    phone: data.phone,
    talle: data.clothing_size,
    condicionAlimenticia: data.dietary_condition,
    companeroFavorito: "No informado"
  });
  newUserForm.reset();
  newUserMessage.textContent = "Usuario agregado en Supabase.";
  renderUsersPanel();
  renderProfileSelector();
});

usersList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("edit-user-btn")) {
    return;
  }
  const user = users.find((item) => item.id === target.dataset.userId);
  if (!user) {
    return;
  }
  adminEditUserForm.elements.id.value = user.id;
  adminEditUserForm.elements.cwid.value = user.cwid ?? "";
  adminEditUserForm.elements.full_name.value = user.name ?? "";
  adminEditUserForm.elements.email.value = user.email ?? "";
  adminEditUserForm.elements.role.value = user.role ?? ROLES.VISITA;
  adminEditUserForm.elements.team.value = user.team ?? "";
  adminEditUserForm.elements.area.value = user.area ?? "";
  adminEditUserForm.hidden = false;
});

adminEditUserForm.elements.role.innerHTML = Object.values(ROLES)
  .map((role) => `<option value="${role}">${role}</option>`)
  .join("");

adminEditUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageUsers(getActiveUser())) {
    return;
  }
  const formData = new FormData(adminEditUserForm);
  const user = users.find((item) => item.id === formData.get("id"));
  if (!user) {
    return;
  }
  const payload = {
    cwid: formData.get("cwid")?.toString().trim().toUpperCase() || null,
    full_name: formData.get("full_name")?.toString().trim(),
    email: formData.get("email")?.toString().trim().toLowerCase(),
    role: formData.get("role")?.toString(),
    team: formData.get("team")?.toString().trim() || null,
    area: formData.get("area")?.toString().trim() || null
  };
  adminEditUserMessage.textContent = "Guardando usuario...";
  const { data, error } = await updateUserInSupabase(user.id, payload);
  if (error) {
    adminEditUserMessage.textContent = error.message;
    return;
  }
  applySupabaseUserData(user, data);
  user.cwid = data.cwid;
  adminEditUserMessage.textContent = "Usuario actualizado en Supabase.";
  renderUsersPanel();
  renderProfileSelector();
  renderProfile();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = getActiveUser();
  if (!canCreateEvents(user)) {
    formMessage.textContent = "No tenes permisos para crear eventos.";
    return;
  }

  const formData = new FormData(eventForm);
  const eventData = {
    id: crypto.randomUUID(),
    title: formData.get("title")?.toString().trim(),
    objective: formData.get("objective")?.toString().trim(),
    location: formData.get("location")?.toString(),
    date: formData.get("date")?.toString(),
    guests: formData.get("guests")?.toString(),
    food: formData.get("food")?.toString().trim(),
    notes: formData.get("notes")?.toString().trim(),
    needsFeedback: formData.get("needsFeedback") === "on",
    needsAssessment: formData.get("needsAssessment") === "on",
    trainingPrimaryLocation: formData.get("trainingPrimaryLocation")?.toString() || null,
    trainingAudience: formData.get("trainingAudience")?.toString() || null,
    trainingDays: formData.get("trainingDays")?.toString() || null,
    trainingModality: formData.get("trainingModality")?.toString() || null,
    ownerEmail: user.email,
    team: user.team,
    experienceType: selectedExperience,
    status: "Borrador"
  };

  const events = getEvents();
  events.push(eventData);
  saveEvents(events);

  formMessage.textContent = "Evento guardado correctamente.";
  eventForm.reset();

  renderEventsPanel();
  renderCalendar();
});

eventsList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) {
    return;
  }

  const user = getActiveUser();
  const eventItem = getEvents().find((item) => item.id === id);

  if (action === "edit") {
    if (!eventItem || !canEditEvent(user, eventItem)) {
      formMessage.textContent = "No tenes permiso para editar este evento.";
      return;
    }
    formMessage.textContent = "Proximo paso: cargar este evento en el formulario para editar.";
    openPanel("nueva-experiencia");
  }

  if (action === "mail") {
    alert("Proximo paso: integrar envio de mails (ej. con Supabase Edge Functions).");
  }
});

calendarLocationSelect.addEventListener("change", renderCalendar);

locationsGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (action !== "edit-site" || !id) {
    return;
  }

  const user = getActiveUser();
  const location = getSiteById(id);
  if (!location || !canEditLocation(user, location)) {
    alert("No tenes permisos para editar este site.");
    return;
  }

  alert(`Edicion habilitada para ${location.name}. Proximo paso: abrir modal de edicion.`);
});

profileSelector.addEventListener("change", () => {
  activeUserId = profileSelector.value;
  rerenderAll();
});

experienceTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedExperience = button.dataset.experience;

    experienceTypeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    renderOrganizarAccess();
    openPanel("nueva-experiencia");
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cwid = normalizeCwid(cwidInput.value);
  loginMessage.textContent = "Verificando usuario...";

  const result = await findUserByCwid(cwid);
  if (result?.error) {
    loginMessage.textContent = result.error;
    return;
  }

  const user = result;
  if (!user) {
    loginMessage.textContent = "No encontramos ese CWID en public.usuarios. Verifica el dato o solicita un usuario.";
    return;
  }

  loginMessage.textContent = "";
  enterApp(user);
});

requestUserButton.addEventListener("click", () => {
  requestUserMessage.textContent = "La solicitud de usuario se habilitara en una proxima etapa. Contacta al administrador de la plataforma.";
});

async function initializeApp() {
  await loadLocationsFromSupabase();
  renderProfileSelector();
  rerenderAll();
}
