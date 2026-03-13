import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMwNDAwNywiZXhwIjoyMDg4ODgwMDA3fQ.CgJx7T6TrDR1RpFuZLVW6qGpXr6hPDJM6pCfQ0p7aXw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createUsersTable() {
  try {
    console.log('🔧 Création de la table users...');
    
    // Lire le fichier SQL
    const sql = readFileSync('supabase/migrations/005_create_users_table.sql', 'utf8');
    
    // Exécuter le SQL (diviser en plusieurs requêtes)
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
        if (error) {
          console.error('❌ Erreur SQL:', error);
        }
      }
    }
    
    console.log('✅ Table users créée avec succès !');
    
    // Tester la table
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('❌ Erreur test table:', error);
    } else {
      console.log('✅ Table users accessible');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

createUsersTable();