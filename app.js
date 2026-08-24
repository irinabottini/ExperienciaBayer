const STORAGE_KEY_EVENTS = "experiencia-bayer-events";

const profile = {
  name: "Usuario Bayer",
  email: "usuario@bayer.com",
  role: "Organizador",
  site: "Pilar"
};

const locations = [
  { id: "pilar", name: "Pilar", province: "Buenos Aires", capacity: 220 },
  { id: "zarate", name: "Zarate", province: "Buenos Aires", capacity: 180 },
  { id: "rancul", name: "Rancul", province: "La Pampa", capacity: 95 },
  { id: "mariaeugenia", name: "Maria Eugenia", province: "Buenos Aires", capacity: 120 },
  { id: "veta", name: "Veta Grande", province: "Cordoba", capacity: 150 },
  { id: "rosario", name: "Rosario", province: "Santa Fe", capacity: 130 }
];

const menuButtons = document.querySelectorAll(".menu-btn");
const panels = document.querySelectorAll(".panel");
const profileNodes = {
  name: document.getElementById("profile-name"),
  email: document.getElementById("profile-email"),
  role: document.getElementById("profile-role"),
  site: document.getElementById("profile-site")
};

const locationsGrid = document.getElementById("locations-grid");
const eventForm = document.getElementById("event-form");
const eventLocationSelect = document.getElementById("event-location");
const calendarLocationSelect = document.getElementById("calendar-location");
const formMessage = document.getElementById("form-message");
const eventsList = document.getElementById("events-list");
const calendarList = document.getElementById("calendar-list");

function getEvents() {
  const data = localStorage.getItem(STORAGE_KEY_EVENTS);
  return data ? JSON.parse(data) : [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
}

function openPanel(panelName) {
  menuButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.panel === panelName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelName}`);
  });
}

function renderProfile() {
  profileNodes.name.textContent = profile.name;
  profileNodes.email.textContent = profile.email;
  profileNodes.role.textContent = profile.role;
  profileNodes.site.textContent = profile.site;
}

function renderLocations() {
  locationsGrid.innerHTML = "";

  locations.forEach((location) => {
    const card = document.createElement("article");
    card.className = "location-card";
    card.innerHTML = `
      <h4>${location.name}</h4>
      <p>${location.province}</p>
      <p>Capacidad estimada: ${location.capacity} personas</p>
    `;
    locationsGrid.appendChild(card);
  });
}

function renderLocationOptions() {
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
  const location = locations.find((item) => item.id === locationId);
  return location ? location.name : "No definido";
}

function renderEventsPanel() {
  const events = getEvents();
  eventsList.innerHTML = "";

  if (events.length === 0) {
    eventsList.innerHTML = '<div class="event-item"><p>Aun no hay eventos creados.</p></div>';
    return;
  }

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((event) => {
    const item = document.createElement("div");
    item.className = "event-item";
    item.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
      <p><strong>Lugar:</strong> ${getLocationName(event.location)}</p>
      <p><strong>Objetivo:</strong> ${event.objective}</p>
      <p><strong>Invitados:</strong> ${event.guests}</p>
      <div class="event-actions">
        <button class="action-btn" type="button" data-action="edit" data-id="${event.id}">Editar</button>
        <button class="action-btn" type="button" data-action="mail" data-id="${event.id}">Disparar mail</button>
      </div>
    `;
    eventsList.appendChild(item);
  });
}

function renderCalendar() {
  const filter = calendarLocationSelect.value;
  const events = getEvents();

  calendarList.innerHTML = "";

  const filtered = events
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
      <p>${event.guests} invitados</p>
    `;
    calendarList.appendChild(item);
  });
}

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openPanel(button.dataset.panel);
  });
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

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
    ownerEmail: profile.email,
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

  if (action === "edit") {
    formMessage.textContent = "Proximo paso: cargar este evento en el formulario para editar.";
    openPanel("organizar");
  }

  if (action === "mail") {
    alert("Proximo paso: integrar envio de mails (ej. con Supabase Edge Functions).");
  }
});

calendarLocationSelect.addEventListener("change", renderCalendar);

renderProfile();
renderLocations();
renderLocationOptions();
renderEventsPanel();
renderCalendar();
