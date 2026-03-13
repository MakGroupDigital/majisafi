#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const env = {};
  
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

async function checkDatabase() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not found');

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('\n🔍 Vérification de la base de données Supabase...\n');

    // Check tables
    const tables = ['users', 'clients', 'depots', 'stock_items', 'sales', 'products', 'audit_logs'];
    const results = [];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error?.code === 'PGRST116') {
          results.push({ table, status: '❌ N\'existe pas' });
        } else {
          results.push({ table, status: `✅ Existe (${count} lignes)` });
        }
      } catch (err) {
        results.push({ table, status: '⚠️ Erreur' });
      }
    }

    console.log('📊 État des tables:');
    results.forEach(({ table, status }) => {
      console.log(`   ${table.padEnd(15)} ${status}`);
    });

    const allExist = results.every(r => r.status.includes('✅'));

    if (allExist) {
      console.log('\n✅ Base de données configurée correctement!');
      console.log('\n💡 Prochaines étapes:');
      console.log('   1. Lancez l\'app: npm run dev');
      console.log('   2. Allez à: http://localhost:3008/?admin=true');
      console.log('   3. Connectez-vous avec vos identifiants');
    } else {
      console.log('\n❌ Certaines tables manquent');
      console.log('\n📋 Exécutez les migrations:');
      console.log('   1. Ouvrez: migrations-setup.html');
      console.log('   2. Copiez chaque migration');
      console.log('   3. Exécutez dans Supabase SQL Editor');
      console.log('   4. Retournez ici et vérifiez');
    }

    console.log('\n');
  } catch (error) {
    console.error('\n❌ Erreur:', error instanceof Error ? error.message : error, '\n');
    process.exit(1);
  }
}

checkDatabase();
