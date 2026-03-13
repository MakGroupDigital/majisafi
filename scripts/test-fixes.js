import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFixes() {
  console.log('🧪 Test des corrections...\n');
  
  try {
    // Test 1: Produits
    console.log('1. Test des produits...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
    } else {
      console.log(`✅ Produits OK (${products?.length || 0} produits trouvés)`);
    }
    
    // Test 2: Audit logs
    console.log('\n2. Test des audit logs...');
    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .limit(5);
    
    if (logsError) {
      console.error('❌ Erreur audit logs:', logsError.message);
    } else {
      console.log(`✅ Audit logs OK (${logs?.length || 0} logs trouvés)`);
    }
    
    // Test 3: Storage
    console.log('\n3. Test du stockage...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Erreur stockage:', storageError.message);
    } else {
      const productBucket = buckets?.find(b => b.name === 'product-images');
      if (productBucket) {
        console.log('✅ Bucket product-images trouvé');
        
        // Test upload d'une image fictive
        const testFile = new File(['test'], 'test.png', { type: 'image/png' });
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`test-${Date.now()}.png`, testFile);
        
        if (uploadError) {
          console.error('❌ Erreur upload test:', uploadError.message);
        } else {
          console.log('✅ Upload test réussi');
        }
      } else {
        console.log('❌ Bucket product-images non trouvé');
      }
    }
    
    console.log('\n🎉 Tests terminés !');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testFixes();