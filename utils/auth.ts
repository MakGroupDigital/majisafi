import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'individual';
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async initialize() {
    // Vérifier si l'utilisateur est déjà authentifié
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

      if (error) {
        // Si l'utilisateur n'existe pas dans la table users, ce n'est pas grave
        console.log('Profil utilisateur non trouvé, création en cours...');
        return;
      }

      if (data) {
        this.currentUser = {
          id: data.id,
          email: data.email,
          role: data.role
        };
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  }

  async signUp(email: string, password: string, role: 'admin' | 'manager' | 'user' = 'user') {
    try {
      // Créer l'utilisateur via Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création');

      // Créer le profil dans la table users
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            role,
          }
        ]);

      if (profileError) throw profileError;

      await this.loadUserProfile(authData.user.id);
      return authData.user;
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
      return data.user;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
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

  isManager(): boolean {
    return this.currentUser?.role === 'manager';
  }
}

export const authService = new AuthService();
