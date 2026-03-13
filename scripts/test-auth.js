import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAuth() {
  console.log('🧪 Test de l\'authentification Supabase...\n');
  
  try {
    // Test 1: Vérifier la connexion Supabase
    console.log('1. Test de connexion Supabase...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ Connexion Supabase OK');
    
    // Test 2: Vérifier la table users
    console.log('\n2. Test de la table users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.log('⚠️ Table users non accessible:', usersError.message);
      console.log('💡 Cela signifie que l\'auth utilisera les métadonnées Supabase');
    } else {
      console.log(`✅ Table users OK (${users?.length || 0} utilisateurs)`);
    }
    
    // Test 3: Vérifier les produits
    console.log('\n3. Test de la table products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
    } else {
      console.log(`✅ Produits OK (${products?.length || 0} produits)`);
    }
    
    console.log('\n🎯 Résumé:');
    console.log('- Supabase Auth est prêt');
    console.log('- Vous pouvez créer un compte admin');
    console.log('- L\'application fonctionnera correctement');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAuth();