# 🔐 Setup Better Auth + Supabase

## ✅ Ce qui a été fait :

1. **Serveur d'authentification corrigé** pour utiliser Supabase au lieu du stockage en mémoire
2. **Migration SQL créée** pour la table `users`
3. **Intégration Better Auth + Supabase** complète

## 🚀 Étapes pour finaliser :

### 1. Créer la table users dans Supabase

**Aller dans Supabase Dashboard → SQL Editor** et exécuter :

```sql
-- Créer la table users pour Better Auth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Politique : Permettre l'insertion lors de l'inscription
CREATE POLICY "Allow insert during signup" ON users
  FOR INSERT
  WITH CHECK (true);
```

### 2. Créer votre compte admin

Une fois la table créée, vous pouvez :

1. **Aller sur** : `http://localhost:3000/?admin=true`
2. **Cliquer "Créer un compte"**
3. **Remplir vos informations** :
   - Email: votre@email.com
   - Password: votre_mot_de_passe
   - Nom: Votre Nom
   - Rôle: **Admin** (important !)
4. **Créer le compte**

### 3. Se connecter normalement

Après création, vous pourrez vous connecter avec vos vrais identifiants à chaque fois !

## 🎯 Avantages :

- ✅ **Persistance réelle** : Vos comptes sont stockés dans Supabase
- ✅ **Sécurité Better Auth** : Authentification robuste
- ✅ **Session maintenue** : Plus de reconnexion forcée
- ✅ **Vos identifiants** : Vous choisissez email/password
- ✅ **Gestion des rôles** : Admin/Client/Manager

## 📝 Note importante :

Le serveur utilise maintenant **Supabase Auth + table users** au lieu du stockage en mémoire. Vos comptes seront persistants et vous pourrez vous connecter avec vos vrais identifiants quand vous voulez !

## 🔧 Commandes :

```bash
# Démarrer le serveur d'auth (Better Auth + Supabase)
npm run auth:server

# Démarrer l'app
npm run dev

# Ou tout en une fois
npm run dev:full
```

Une fois la table créée, tout fonctionnera comme vous le souhaitez ! 🚀