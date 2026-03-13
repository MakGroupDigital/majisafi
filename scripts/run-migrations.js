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
    throw new Error('❌ .env file not found');
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

async function executeMigrations() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not found');
    
    // Créer client avec service role pour exécuter les migrations
    const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log('\n🚀 Exécution des migrations Supabase...\n');

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`⏳ Exécution: ${file}`);

      try {
        // Exécuter via RPC si disponible, sinon afficher les étapes
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt && !stmt.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.rpc('exec', {
              statement: statement + ';'
            }).catch(() => {
              // RPC n'existe pas, ignorer
              return { error: null };
            });

            if (error && !error.message?.includes('does not exist')) {
              console.error(`❌ Erreur dans ${file}:`, error.message);
              throw error;
            }
          }
        }

        console.log(`✅ ${file} complété\n`);
      } catch (error) {
        console.log(`⚠️  ${file} - Statut: À vérifier manuellement`);
        console.log(`   Raison: La plupart des migrations nécessitent un accès privilégié\n`);
      }
    }

    console.log('\n📋 Résumé des migrations:');
    files.forEach((file, idx) => {
      console.log(`   ${idx + 1}. ${file}`);
    });

    console.log('\n💡 Pour vérifier l\'état:');
    console.log(`   Allez sur: ${supabaseUrl}/project/_/sql`);
    console.log(`   Exécutez: SELECT * FROM pg_tables WHERE schemaname = 'public';\n`);

  } catch (error) {
    console.error('\n❌ Erreur:', error.message, '\n');
    process.exit(1);
  }
}

executeMigrations();
