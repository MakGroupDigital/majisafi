-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  size VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity_per_package INT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('unite', 'paquet')),
  image_url TEXT,
  product_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table (for tracking product sales)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Insert seed data for products
INSERT INTO products (name, size, price, quantity_per_package, type, description, product_type, image_url)
VALUES
  ('Eau Pure Maji Safi', '350ml', 500, 24, 'paquet', 'Format individuel - Paquet de 24', 'bottle', '/gamme/350CL.png'),
  ('Eau Pure Maji Safi', '1L', 1800, 12, 'paquet', 'Portable et pratique - Paquet de 12', 'bottle', '/gamme/1L.png'),
  ('Eau Pure Maji Safi', '5L', 4500, NULL, 'unite', 'Taille intermédiaire', 'bottle', '/gamme/5L.png'),
  ('Eau Pure Maji Safi', '7.5L', 1200, 6, 'paquet', 'Paquet économique - Paquet de 6', 'bottle', '/gamme/7500CL.png'),
  ('Eau Pure Maji Safi', '10L', 8500, NULL, 'unite', 'Parfait pour les familles', 'bottle', '/gamme/10L.png');
