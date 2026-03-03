import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  type StoredUser,
  type CurrentUser,
} from '../authStorage';

describe('authStorage', () => {
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    const store: Record<string, string> = {};
    // @ts-expect-error - simple mock for localStorage in tests
    global.localStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      key: vi.fn(),
      length: 0,
    };
  });

  it('saves and retrieves users', () => {
    const users: StoredUser[] = [
      { email: 'test@example.com', password: '123456' },
    ];

    saveUsers(users);
    const stored = getUsers();

    expect(stored).toHaveLength(1);
    expect(stored[0].email).toBe('test@example.com');
  });

  it('saves and retrieves current user', () => {
    const user: CurrentUser = { email: 'current@example.com' };

    setCurrentUser(user);
    const stored = getCurrentUser();

    expect(stored).not.toBeNull();
    expect(stored?.email).toBe('current@example.com');

    clearCurrentUser();
    const cleared = getCurrentUser();
    expect(cleared).toBeNull();
  });

  afterEach(() => {
    // @ts-expect-error restore
    global.localStorage = originalLocalStorage;
  });
});

