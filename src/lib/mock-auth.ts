// UI-only auth for client-space gating (localStorage).
// Later: replace with Supabase Auth without changing route structure.

export type Session = {
  name: string;
  email: string;
  createdAt: string; // ISO
};

const KEY = "moConsult:auth:session";
const USERS_KEY = "moConsult:auth:users";

export type User = {
  name: string;
  email: string;
  // UI-only: stored locally. Replace with Supabase Auth later.
  password: string;
  createdAt: string; // ISO
};

export function isBrowser() {
  return typeof window !== "undefined";
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.name !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isAuthed(): boolean {
  return !!getSession();
}

function loadUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): { ok: boolean; error?: string } {
  if (!isBrowser()) return { ok: false, error: "Browser only" };
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!name) return { ok: false, error: "Nom obligatoire" };
  if (!email || !email.includes("@")) return { ok: false, error: "Email invalide" };
  if (!password || password.length < 6) return { ok: false, error: "Mot de passe (min 6 caractères)" };

  try {
    const users = loadUsers();
    const existingIdx = users.findIndex((u) => u.email === email);
    const user: User = { name, email, password, createdAt: new Date().toISOString() };
    if (existingIdx >= 0) users[existingIdx] = user;
    else users.push(user);
    saveUsers(users);

    const session: Session = { name, email, createdAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(session));
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible de sauvegarder l'inscription" };
  }
}

export function signIn(email: string, password: string): { ok: boolean; error?: string } {
  if (!isBrowser()) return { ok: false, error: "Browser only" };
  const cleaned = email.trim().toLowerCase();
  if (!cleaned || !cleaned.includes("@")) return { ok: false, error: "Email invalide" };
  try {
    const users = loadUsers();
    const user = users.find((u) => u.email === cleaned);
    if (!user) return { ok: false, error: "Compte introuvable. Inscrivez-vous." };
    if (user.password !== password) return { ok: false, error: "Mot de passe incorrect" };

    const session: Session = { name: user.name, email: cleaned, createdAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(session));
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible de sauvegarder la session" };
  }
}

export function signOut() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function ensureDemoUser() {
  registerUser({ name: "Demo", email: "demo@moconsult.local", password: "demo123" });
}
