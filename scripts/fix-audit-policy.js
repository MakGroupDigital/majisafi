const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixAuditPolicy() {
  try {
    console.log('Suppression de l\'ancienne politique...');
    
    // Drop the old policy
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: `DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;`
    });
    
    if (dropError) {
      console.error('Erreur lors de la suppression:', dropError);
    }
    
    console.log('Création de la nouvelle politique...');
    
    // Create new policy
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Authenticated users can view audit logs" ON audit_logs
          FOR SELECT
          USING (auth.uid() IS NOT NULL);
      `
    });
    
    if (createError) {
      console.error('Erreur lors de la création:', createError);
    } else {
      console.log('✅ Politique d\'audit corrigée avec succès!');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

fixAuditPolicy();