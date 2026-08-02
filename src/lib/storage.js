const REPORTS_KEY = "jalrakshak_reports_v1";
const CLASSIFIER_KEY = "jalrakshak_classifier_v1";
const FLEET_KEY = "jalrakshak_fleet_v1";
const TICKETS_KEY = "jalrakshak_tickets_v1";

export function getReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getReport(id) {
  return getReports().find((r) => r.id === id) || null;
}

export function saveReport(report) {
  const reports = getReports();
  reports.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return reports;
}

export function updateReport(id, patch) {
  const reports = getReports().map((r) => (r.id === id ? { ...r, ...patch } : r));
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return reports;
}

// --- Trained classifier dataset persistence ---

export function saveClassifierDataset(serializable) {
  localStorage.setItem(CLASSIFIER_KEY, JSON.stringify(serializable));
}

export function loadClassifierDataset() {
  try {
    const raw = localStorage.getItem(CLASSIFIER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// --- Fleet status snapshot (written by Dashboard, read by Management/Services) ---

export function saveFleetStatus(units) {
  localStorage.setItem(FLEET_KEY, JSON.stringify({ units, updatedAt: Date.now() }));
}

export function getFleetStatus() {
  try {
    const raw = localStorage.getItem(FLEET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// --- Help center tickets ---

export function getTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTicket(ticket) {
  const tickets = getTickets();
  tickets.push(ticket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  return tickets;
}

export function resolveTicket(id) {
  const tickets = getTickets().map((t) => (t.id === id ? { ...t, resolved: true } : t));
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  return tickets;
}
