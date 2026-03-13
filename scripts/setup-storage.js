import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDQwMDcsImV4cCI6MjA4ODg4MDAwN30.0vSLjrcYJ1Jz5VUXu_iXiPtalgg5peC2QufWav2ZVbY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupStorage() {
  try {
    console.log('Vérification du bucket product-images...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erreur lors de la liste des buckets:', listError);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
    
    if (!bucketExists) {
      console.log('Création du bucket product-images...');
      
      const { data, error } = await supabase.storage.createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        console.error('Erreur lors de la création du bucket:', error);
      } else {
        console.log('✅ Bucket product-images créé avec succès!');
      }
    } else {
      console.log('✅ Bucket product-images existe déjà');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

setupStorage();