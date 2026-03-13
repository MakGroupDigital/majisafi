/**
 * 🔐 Supabase Auth Service
 * Service d'authentification utilisant directement Supabase
 */

import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'client';
}

class SupabaseAuthService {
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  async initialize() {
    // Vérifier la session existante
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }
    
    // Écouter les changements d'authentification
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.currentUser = null;
        this.notifyListeners();
      }
    });
  }

  private async loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Si pas de profil en DB, utiliser les métadonnées Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          this.currentUser = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'client'
          };
        }
      } else {
        this.currentUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role
        };
      }
      
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  }

  async signUp(email: string, password: string, role: 'admin' | 'client' = 'client', name = '') {
    try {
      // Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création');

      // Créer le profil dans la table users (si la table existe)
      try {
        await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              role,
            }
          ]);
      } catch (profileError) {
        // Ignorer si la table n'existe pas encore
        console.log('Table users non disponible, utilisation des métadonnées');
      }

      await this.loadUserProfile(authData.user.id);
      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Erreur de connexion');

      await this.loadUserProfile(data.user.id);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
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
}

export const supabaseAuthService = new SupabaseAuthService();