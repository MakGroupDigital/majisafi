-- Table des véhicules
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('truck', 'van', 'motorcycle', 'car')),
  brand VARCHAR(50),
  model VARCHAR(50),
  year INTEGER,
  capacity_kg DECIMAL(10,2),
  capacity_liters DECIMAL(10,2),
  gps_device_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'out_of_service')),
  depot_id UUID REFERENCES depots(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des chauffeurs
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_expiry DATE,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'on_duty', 'off_duty', 'suspended')),
  depot_id UUID REFERENCES depots(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des livraisons
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_address TEXT NOT NULL,
  client_lat DECIMAL(10, 8),
  client_lng DECIMAL(11, 8),
  depot_id UUID REFERENCES depots(id) NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled', 'failed')),
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'mobile', 'check')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de livraison
CREATE TABLE IF NOT EXISTS delivery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_size VARCHAR(50),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de suivi GPS en temps réel
CREATE TABLE IF NOT EXISTS gps_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  delivery_id UUID REFERENCES deliveries(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5,2), -- km/h
  heading INTEGER, -- degrés 0-360
  altitude DECIMAL(8,2), -- mètres
  accuracy DECIMAL(8,2), -- mètres
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_depot ON deliveries(depot_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_vehicle ON gps_tracking(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_delivery ON gps_tracking(delivery_id);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_timestamp ON gps_tracking(timestamp DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();