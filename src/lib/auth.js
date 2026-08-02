const USERS_KEY = "jalrakshak_users_v1";
const SESSION_KEY = "jalrakshak_session_v1";

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup({ name, email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === cleanEmail)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  if (!name.trim() || !cleanEmail || password.length < 4) {
    return { ok: false, error: "Please fill all fields — password must be at least 4 characters." };
  }
  const user = { name: name.trim(), email: cleanEmail, password, joinedAt: Date.now() };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, cleanEmail);
  return { ok: true, user: publicUser(user) };
}

export function login({ email, password }) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === cleanEmail && u.password === password);
  if (!user) return { ok: false, error: "Incorrect email or password." };
  localStorage.setItem(SESSION_KEY, cleanEmail);
  return { ok: true, user: publicUser(user) };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const user = getUsers().find((u) => u.email === email);
  return user ? publicUser(user) : null;
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}
