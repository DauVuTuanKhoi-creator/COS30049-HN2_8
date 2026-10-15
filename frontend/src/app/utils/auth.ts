// Authentication utility with FastAPI integration
import { apiService } from '@/app/services/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const AUTH_STORAGE_KEY = 'secureguard_user';
const AUTH_TOKEN_KEY = 'auth_token';

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = false;

// Mock functions for fallback
function mockSignIn(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
}

function mockSignUp(name: string, email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password.length >= 6) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Please fill all fields correctly'));
      }
    }, 500);
  });
}

export async function signIn(email: string, password: string): Promise<User> {
  if (USE_MOCK_DATA) {
    return mockSignIn(email, password);
  }

  try {
    const response = await apiService.signIn(email, password);
    const user: User = response.user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    apiService.signOut();
    throw error instanceof Error ? error : new Error('Sign in failed');
  }
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  if (USE_MOCK_DATA) {
    return mockSignUp(name, email, password);
  }

  try {
    const response = await apiService.signUp(name, email, password);
    const user: User = response.user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    apiService.signOut();
    throw error instanceof Error ? error : new Error('Sign up failed');
  }
}

export function signOut(): void {
  apiService.signOut();
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!userStr) {
    return null;
  }

  if (!authToken) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
  }

  return null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}