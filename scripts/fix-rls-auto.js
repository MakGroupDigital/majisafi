#!/usr/bin/env node

/**
 * 🔧 Script d'Application Automatique des RLS Policies via Supabase REST API
 * Applique les corrections RLS en exécutant le SQL via l'API Supabase
 * 
 * Usage: node scripts/fix-rls-auto.js
 */

import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('❌ Erreur: Clés Supabase manquantes dans .env');
  process.exit(1);
}

const sql = `
DROP POLICY IF EXISTS "Admins can manage users" ON users;

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
`;

async function fixRlsPolicies() {
  console.log('🔧 Application des RLS Policies...\n');

  try {
    // Essayer via la fonction RPC du projet (si elle existe)
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/sql_execute`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ query: sql })
      }
    );

    if (response.ok) {
      console.log('✅ RLS Policies appliquées automatiquement!\n');
    } else {
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (err) {
    console.log('⚠️  API Supabase n\'a pas de fonction RPC disponible');
    console.log('\n📋 SOLUTION: Exécution manuelle (plus rapide)\n');
    console.log('Copie le SQL et colle-le dans Supabase SQL Editor:\n');
    console.log('1. Allez à: https://app.supabase.com/');
    console.log('2. Projet: biddiqgmwrdhozksietf');
    console.log('3. SQL Editor (top left)');
    console.log('4. Copie le SQL ci-dessous:');
    console.log('\n' + '='.repeat(70));
    console.log(sql);
    console.log('='.repeat(70) + '\n');
    console.log('5. Colle dans SQL Editor et appuie sur Ctrl+Enter');
    console.log('6. Vérifies que ✅ 5 statements exécutés');
    console.log('7. Attendez 30 secondes');
    console.log('8. Rechargez le navigateur (F5)');
    console.log('9. Créez un compte avec EMAIL DIFFÉRENT (pas admin@majisafi.com)\n');
  }
}

fixRlsPolicies();
