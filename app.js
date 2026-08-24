const STORAGE_KEY_EVENTS = "experiencia-bayer-events";

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
    name: "Irina Bottini",
    email: "irina@bayer.com",
    role: ROLES.ADMIN,
    siteId: "pilar",
    team: "Comunicacion",
    area: "Comunicaciones",
    phone: "+54 9 11 1111-1111"
  },
  {
    id: "u2",
    name: "Carlos Ejemplo",
    email: "carlos.ce@bayer.com",
    role: ROLES.LIDER,
    siteId: "zarate",
    team: "CE",
    area: "Direccion",
    phone: "+54 9 11 2222-2222"
  },
  {
    id: "u3",
    name: "Laura Site",
    email: "laura.site@bayer.com",
    role: ROLES.SITE_REF,
    siteId: "pilar",
    team: "Operaciones",
    area: "Site Management",
    phone: "+54 9 11 3333-3333"
  },
  {
    id: "u4",
    name: "Martin Equipo",
    email: "martin.equipo@bayer.com",
    role: ROLES.TEAM_REF,
    siteId: "pilar",
    team: "Marketing",
    area: "Comercial",
    phone: "+54 9 11 4444-4444"
  },
  {
    id: "u5",
    name: "Sofia Organiza",
    email: "sofia.organiza@bayer.com",
    role: ROLES.ORG,
    siteId: "rosario",
    team: "Marketing",
    area: "Comercial",
    phone: "+54 9 11 5555-5555"
  },
  {
    id: "u6",
    name: "Invitado Externo",
    email: "visita@externo.com",
    role: ROLES.VISITA,
    siteId: "zarate",
    team: "Visitante",
    area: "N/A",
    phone: "N/A"
  }
];

let activeUserId = users[0].id;

const locations = [
  {
    id: "pilar",
    name: "Pilar",
    province: "Buenos Aires",
    capacity: 220,
    managerEmail: "laura.site@bayer.com",
    notes: "Site principal para jornadas corporativas"
  },
  {
    id: "zarate",
    name: "Zarate",
    province: "Buenos Aires",
    capacity: 180,
    managerEmail: "carlos.ce@bayer.com",
    notes: "Alta demanda para visitas tecnicas"
  },
  {
    id: "rancul",
    name: "Rancul",
    province: "La Pampa",
    capacity: 95,
    managerEmail: "laura.site@bayer.com",
    notes: "Capacitaciones de escala media"
  },
  {
    id: "mariaeugenia",
    name: "Maria Eugenia",
    province: "Buenos Aires",
    capacity: 120,
    managerEmail: "martin.equipo@bayer.com",
    notes: "Site con foco en generacion de demanda"
  },
  {
    id: "veta",
    name: "Veta Grande",
    province: "Cordoba",
    capacity: 150,
    managerEmail: "martin.equipo@bayer.com",
    notes: "Eventos mixtos internos y externos"
  },
  {
    id: "rosario",
    name: "Rosario",
    province: "Santa Fe",
    capacity: 130,
    managerEmail: "sofia.organiza@bayer.com",
    notes: "Agenda comercial y demostraciones"
  }
];

const experienceLabels = {
  field_tour: "Bayer Field Tour",
  generacion: "Generacion de demanda",
  capacitacion: "Jornadas de capacitacion",
  licencias: "Licencias",
  eventos_bayer: "Eventos Bayer",
  visitas_site: "Visitas a site"
};

let selectedExperience = "capacitacion";

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
  permissions: document.getElementById("profile-permissions")
};

const locationsGrid = document.getElementById("locations-grid");
const eventForm = document.getElementById("event-form");
const eventLocationSelect = document.getElementById("event-location");
const calendarLocationSelect = document.getElementById("calendar-location");
const formMessage = document.getElementById("form-message");
const eventsList = document.getElementById("events-list");
const calendarList = document.getElementById("calendar-list");
const profileSelector = document.getElementById("profile-selector");
const eventsScopeCopy = document.getElementById("events-scope-copy");
const usersList = document.getElementById("users-list");
const organizarAccessNote = document.getElementById("organizar-access-note");
const experienceNote = document.getElementById("experience-note");
const trainingLogicBox = document.getElementById("training-logic");
const menuUsuarios = document.getElementById("menu-usuarios");
const experienceTypeButtons = document.querySelectorAll(".experience-type-btn");

function getActiveUser() {
  return users.find((user) => user.id === activeUserId) ?? users[0];
}

function isAdminOrLeader(user) {
  return user.role === ROLES.ADMIN || user.role === ROLES.LIDER;
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
  if (panelName === "usuarios" && !isAdminOrLeader(getActiveUser())) {
    alert("Solo administradores y lideres pueden acceder a Usuarios App.");
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
  profileNodes.permissions.textContent = getRolePermissionText(user);
}

function renderLocations() {
  const user = getActiveUser();
  locationsGrid.innerHTML = "";

  locations.forEach((location) => {
    const card = document.createElement("article");
    card.className = "location-card";
    const editable = canEditLocation(user, location);
    card.innerHTML = `
      <h4>${location.name}</h4>
      <p>${location.province}</p>
      <p>Capacidad estimada: ${location.capacity} personas</p>
      <p><strong>Responsable:</strong> ${location.managerEmail}</p>
      <p>${location.notes}</p>
      <p><strong>Permiso:</strong> ${editable ? "Puede editar" : "Solo lectura"}</p>
      <button class="action-btn" type="button" data-action="edit-site" data-id="${location.id}" ${editable ? "" : "disabled"}>
        Editar informacion del site
      </button>
    `;
    locationsGrid.appendChild(card);
  });
}

function renderLocationOptions() {
  eventLocationSelect.innerHTML = "";
  calendarLocationSelect.innerHTML = '<option value="all">Todos los sites</option>';

  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.id;
    option.textContent = `${location.name} (${location.province})`;

    eventLocationSelect.appendChild(option.cloneNode(true));
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
  if (!isAdminOrLeader(user)) {
    usersList.innerHTML = '<div class="event-item"><p>No tenes permisos para visualizar usuarios.</p></div>';
    return;
  }

  usersList.innerHTML = users
    .map(
      (item) => `
      <div class="event-item">
        <h4>${item.name}</h4>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Rol:</strong> ${item.role}</p>
        <p><strong>Site:</strong> ${getLocationName(item.siteId)}</p>
        <p><strong>Equipo:</strong> ${item.team}</p>
      </div>
    `
    )
    .join("");
}

function renderOrganizarAccess() {
  const user = getActiveUser();
  const allowed = canCreateEvents(user);
  eventForm.style.display = allowed ? "grid" : "none";
  organizarAccessNote.textContent = allowed
    ? "Este modulo esta disponible para tu rol."
    : "Tu rol es Visita: no podes organizar eventos porque no tenes rol operativo en sistema.";

  experienceNote.textContent = `Experiencia seleccionada: ${experienceLabels[selectedExperience]}.`;
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
  menuUsuarios.hidden = !isAdminOrLeader(getActiveUser());
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

renderProfileSelector();
rerenderAll();
