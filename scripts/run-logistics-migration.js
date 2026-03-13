import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://biddiqgmwrdhozksietf.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZGRpcWdtd3JkaG96a3NpZXRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMwNDAwNywiZXhwIjoyMDg4ODgwMDA3fQ.nHNth4hs6FOD1SiWrUDDlzT_RaNPYGQ1167ksKI3XPo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runLogisticsMigration() {
  try {
    console.log('🚛 Exécution de la migration logistique...');
    
    const sqlContent = fs.readFileSync('supabase/migrations/006_create_logistics_tables.sql', 'utf8');
    
    // Diviser le script en commandes individuelles
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command.trim()) {
        console.log(`Exécution: ${command.substring(0, 80)}...`);
        try {
          // Exécuter directement via SQL
          const { error } = await supabase.rpc('exec', { sql: command });
          if (error) {
            console.error(`❌ Erreur: ${error.message}`);
          } else {
            console.log('✅ OK');
          }
        } catch (err) {
          console.error(`❌ Erreur d'exécution: ${err.message}`);
        }
      }
    }
    
    console.log('🎉 Migration logistique terminée !');
    
    // Ajouter quelques données de test
    console.log('📝 Ajout de données de test...');
    
    // Test de création d'un véhicule
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .insert([{
        license_plate: 'CD-001-KIN',
        vehicle_type: 'truck',
        brand: 'Toyota',
        model: 'Hiace',
        year: 2020,
        capacity_kg: 1500,
        capacity_liters: 2000,
        gps_device_id: 'GPS-001',
        status: 'available'
      }])
      .select()
      .single();
    
    if (vehicleError) {
      console.error('❌ Erreur véhicule:', vehicleError.message);
    } else {
      console.log('✅ Véhicule de test créé:', vehicleData.license_plate);
    }
    
    // Test de création d'un chauffeur
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .insert([{
        first_name: 'Jean',
        last_name: 'Mukendi',
        phone: '+243812345678',
        email: 'jean.mukendi@majisafi.cd',
        license_number: 'LIC-001-2024',
        license_expiry: '2025-12-31',
        status: 'available'
      }])
      .select()
      .single();
    
    if (driverError) {
      console.error('❌ Erreur chauffeur:', driverError.message);
    } else {
      console.log('✅ Chauffeur de test créé:', `${driverData.first_name} ${driverData.last_name}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

runLogisticsMigration();