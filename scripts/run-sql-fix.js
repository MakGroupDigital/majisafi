import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMwNDAwNywiZXhwIjoyMDg4ODgwMDA3fQ.nHNth4hs6FOD1SiWrUDDlzT_RaNPYGQ1167ksKI3XPo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runSQLFix() {
  try {
    console.log('🔧 Exécution du script de correction SQL...');
    
    const sqlContent = fs.readFileSync('scripts/fix-simple.sql', 'utf8');
    
    // Diviser le script en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command.trim()) {
        console.log(`Exécution: ${command.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        if (error) {
          console.error(`Erreur: ${error.message}`);
        } else {
          console.log('✅ OK');
        }
      }
    }
    
    console.log('🎉 Script de correction terminé !');
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution:', error);
  }
}

runSQLFix();