#!/usr/bin/env node

/**
 * 🔐 Better Auth Server
 * Authentification pour Maji Safi Ya Kwetu
 * Utilise Better Auth API + Supabase pour la persistance
 * 
 * Usage: node server/auth-server.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.AUTH_SERVER_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BETTER_AUTH_KEY = process.env.BETTER_AUTH_API_KEY;

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Logs de démarrage
console.log('🔐 Better Auth Server Configuration:');
console.log('   PORT:', PORT);
console.log('   JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   BETTER_AUTH_KEY:', BETTER_AUTH_KEY ? '✅ Set' : '❌ Missing');
console.log('   SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '✅ Auth Server is running with Better Auth + Supabase',
    timestamp: new Date().toISOString()
  });
});

// Inscription (Signup) - Utilise Supabase Auth directement
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, role = 'client', name = '' } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et password requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimum 8 caractères' });
    }

    // Créer l'utilisateur dans Supabase Auth (méthode publique)
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

    if (authError) {
      console.error('❌ Supabase Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Erreur création utilisateur' });
    }

    // Créer le profil utilisateur dans la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('❌ User profile error:', userError);
      // Continuer même si l'insertion échoue (table peut ne pas exister encore)
    }

    console.log(`✅ User created: ${email} (${role})`);

    // Créer JWT
    const token = jwt.sign(
      { id: authData.user.id, email, role, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: authData.user.id,
        email,
        name,
        role
      }
    });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ error: 'Signup échoué: ' + err.message });
  }
});

// Connexion (Signin) - Utilise Supabase Auth directement
app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et password requis' });
    }

    // Authentifier avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return res.status(401).json({ error: 'Email ou password incorrect' });
    }

    // Récupérer le profil utilisateur (ou utiliser les métadonnées)
    let userData = null;
    const { data: profileData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !profileData) {
      // Si pas de profil en DB, utiliser les métadonnées de Supabase Auth
      userData = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || '',
        role: authData.user.user_metadata?.role || 'client'
      };
    } else {
      userData = profileData;
    }

    console.log(`✅ User signed in: ${email}`);

    // Créer JWT
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role, 
        name: userData.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    });
  } catch (err) {
    console.error('❌ Signin error:', err.message);
    res.status(500).json({ error: 'Signin échoué: ' + err.message });
  }
});

// Vérifier JWT
app.post('/auth/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Refresh Token
app.post('/auth/refresh', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: newToken
    });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnecté' });
});

// Get current user
app.get('/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Démarrer serveur
app.listen(PORT, () => {
  console.log(`\n✅ Better Auth Server Démarré sur port ${PORT}!`);
  console.log(`   🌐 URL: http://localhost:${PORT}`);
  console.log(`\n📝 Endpoints:`);
  console.log(`   POST /auth/signup    - Créer compte`);
  console.log(`   POST /auth/signin    - Se connecter`);
  console.log(`   POST /auth/verify    - Vérifier token`);
  console.log(`   POST /auth/refresh   - Nouveau token`);
  console.log(`   POST /auth/logout    - Déconnexion`);
  console.log(`   GET  /auth/me        - Infos user`);
  console.log(`   GET  /health         - Health check\n`);
});
