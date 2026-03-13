import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixAll() {
  console.log('🔧 Test de connexion à Supabase...\n');
  
  try {
    // Test simple : récupérer les produits
    console.log('1. Test de récupération des produits...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
    } else {
      console.log('✅ Connexion produits OK');
    }
    
    // Test audit logs
    console.log('\n2. Test de récupération des audit logs...');
    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .limit(1);
    
    if (logsError) {
      console.error('❌ Erreur audit logs:', logsError);
      console.log('💡 Vous devez exécuter le script SQL manuellement dans Supabase');
    } else {
      console.log('✅ Audit logs OK, nombre de logs:', logs?.length || 0);
    }
    
    // Test storage
    console.log('\n3. Test du stockage...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Erreur stockage:', storageError);
    } else {
      const productBucket = buckets?.find(b => b.name === 'product-images');
      if (productBucket) {
        console.log('✅ Bucket product-images existe');
      } else {
        console.log('⚠️ Bucket product-images n\'existe pas');
      }
    }
    
    console.log('\n📋 Résumé:');
    console.log('- Pour corriger les audit logs, exécutez le fichier scripts/fix-simple.sql dans Supabase');
    console.log('- Les fonctionnalités de base devraient fonctionner');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

fixAll();