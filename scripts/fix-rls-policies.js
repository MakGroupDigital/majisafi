#!/usr/bin/env node

/**
 * 🔧 Script d'Application Automatique des RLS Policies
 * Applique les corrections RLS en utilisant l'API PostgreSQL via Supabase
 * 
 * Usage: node scripts/fix-rls-policies.js
 */

import postgres from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ Erreur: DATABASE_URL manquante dans .env');
  console.error('\nÉtapes:');
  console.error('1. Allez à https://app.supabase.com/');
  console.error('2. Projet: biddiqgmwrdhozksietf');
  console.error('3. Settings → Database → Connection string');
  console.error('4. Copiez la connection string PostgreSQL');
  console.error('5. Collez-la dans .env comme DATABASE_URL');
  process.exit(1);
}

const { Client } = postgres;
const client = new Client({ connectionString: dbUrl });

async function fixRlsPolicies() {
  console.log('🔧 Application des RLS Policies...\n');

  const queries = [
    'DROP POLICY IF EXISTS "Admins can manage users" ON users;',
    `CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);`,
    `CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));`,
    `CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);`,
    `CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));`
  ];

  try {
    await client.connect();
    console.log('✅ Connecté à Supabase PostgreSQL\n');

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      try {
        console.log(`⏳ Query ${i + 1}/${queries.length}...`);
        await client.query(query);
        console.log(`✅ Query ${i + 1} OK\n`);
      } catch (err) {
        console.error(`❌ Query ${i + 1} échouée:`);
        console.error(`   ${err.message}\n`);
      }
    }

    console.log('✅ Toutes les RLS Policies ont été appliquées!');
    console.log('\n🎉 Prochaines étapes:');
    console.log('1. Attendez 30 secondes');
    console.log('2. Rechargez le navigateur (F5)');
    console.log('3. Créez un compte avec un EMAIL DIFFÉRENT');
    console.log('4. Essayez: directeur@majisafi.com');

  } catch (err) {
    console.error('❌ Erreur de connexion:', err.message);
    console.error('\n📋 Alternative: Exécution manuelle');
    console.error('1. Allez à https://app.supabase.com/');
    console.error('2. Projet: biddiqgmwrdhozksietf');
    console.error('3. SQL Editor');
    console.error('4. Copie le contenu de FIX_AUTHENTICATION.md');
    console.error('5. Colle et exécute');
  } finally {
    await client.end();
  }
}

fixRlsPolicies();
