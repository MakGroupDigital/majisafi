import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction d'audit (copie de celle dans supabase.ts)
const auditAPI = {
  async log(params) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([
        {
          admin_id: userData?.user?.id,
          admin_email: userData?.user?.email || 'test@example.com',
          action_type: params.action_type,
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          entity_name: params.entity_name,
          old_values: params.old_values,
          new_values: params.new_values,
          description: params.description,
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Audit log error:', error);
    } else {
      console.log('✅ Audit log créé:', data);
    }
    
    return data;
  }
};

async function testAudit() {
  console.log('🧪 Test des logs d\'audit...\n');
  
  try {
    // Test 1: Créer un log d'audit directement
    console.log('1. Test de création d\'un log d\'audit...');
    
    await auditAPI.log({
      action_type: 'CREATE',
      entity_type: 'product',
      entity_id: 'test-123',
      entity_name: 'Test Product 1L',
      new_values: { name: 'Test Product', size: '1L', price: 1000 },
      description: 'Test de création de produit'
    });
    
    // Test 2: Lire les logs
    console.log('\n2. Lecture des logs d\'audit...');
    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (logsError) {
      console.error('❌ Erreur lecture logs:', logsError);
    } else {
      console.log(`✅ ${logs.length} logs trouvés:`);
      logs.forEach(log => {
        console.log(`  - ${log.action_type} ${log.entity_type}: ${log.entity_name} (${new Date(log.created_at).toLocaleString()})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testAudit();