/**
 * 🔐 Better Auth Service
 * Client pour communiquer avec le serveur d'authentification
 */

const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:5000';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'client';
}

class BetterAuthService {
  private token: string | null = localStorage.getItem('auth_token');
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  async initialize() {
    if (this.token) {
      try {
        // Vérifier que le token est encore valide
        const response = await fetch(`${AUTH_SERVER_URL}/auth/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.currentUser = data.user;
          this.notifyListeners();
        } else {
          this.clearAuth();
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        this.clearAuth();
      }
    }
  }

  async signUp(email: string, password: string, role: 'admin' | 'client' = 'client', name = '') {
    try {
      const response = await fetch(`${AUTH_SERVER_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur inscription');
      }

      const data = await response.json();
      this.setAuth(data.token, data.user);
      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await fetch(`${AUTH_SERVER_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur connexion');
      }

      const data = await response.json();
      this.setAuth(data.token, data.user);
      return data.user;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  async signOut() {
    this.clearAuth();
  }

  private setAuth(token: string, user: AuthUser) {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem('auth_token', token);
    this.notifyListeners();
  }

  private clearAuth() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    this.notifyListeners();
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isClient(): boolean {
    return this.currentUser?.role === 'client';
  }

  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.add(callback);
    // Retourner une fonction pour unsubscribe
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  getAuthHeader() {
    if (!this.token) return {};
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}

export const betterAuthService = new BetterAuthService();
