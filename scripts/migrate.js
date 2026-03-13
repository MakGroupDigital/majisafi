#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

function readMigrationFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').trim();
}

async function runMigrations() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not found in .env');
    }

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      throw new Error('Migrations directory not found');
    }
    
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`\n🚀 Supabase Migration Runner\n`);
    console.log(`📁 Found ${files.length} migration files:\n`);
    
    files.forEach((file, idx) => {
      const filePath = path.join(migrationsDir, file);
      const sql = readMigrationFile(filePath);
      const lines = sql.split('\n').length;
      console.log(`   ${idx + 1}. ${file} (${lines} lines)`);
    });
    
    console.log(`\n📋 Two options to execute:\n`);
    console.log(`   Option 1: Quick SQL Editor (recommended):`);
    console.log(`   👉 1. Run: npm run migrate:sql`);
    console.log(`      2. Open the generated migrations-setup.html file`);
    console.log(`      3. Click "Copy SQL" for each migration`);
    console.log(`      4. Paste into Supabase SQL Editor\n`);
    
    console.log(`   Option 2: Manual execution:`);
    console.log(`   👉 ${supabaseUrl}/project/_/sql\n`);
    
    console.log(`\n💡 Files location:`);
    files.forEach((file, idx) => {
      const filePath = path.join(migrationsDir, file);
      console.log(`   ${idx + 1}️⃣  ${filePath}`);
    });
    
    console.log(`\n✨ Ready to execute! Run: npm run migrate:sql\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  }
}

runMigrations();
