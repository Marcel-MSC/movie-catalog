export type StoredUser = {
  email: string;
  password: string;
};

export type CurrentUser = {
  email: string;
};

const USERS_KEY = 'mc_users';
const CURRENT_USER_KEY = 'mc_currentUser';

export const getUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users: StoredUser[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): CurrentUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: CurrentUser): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

