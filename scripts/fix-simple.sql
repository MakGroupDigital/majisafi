-- Supprimer TOUTES les politiques d'audit existantes
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow all authenticated users to view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert audit logs" ON audit_logs;

-- Désactiver temporairement RLS pour corriger
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Créer des politiques très simples sans référence à auth.uid()
CREATE POLICY "Public read audit logs" ON audit_logs
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Créer le bucket pour les images de produits (si pas déjà fait)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload d'images (public pour simplifier)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Public upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Politique pour permettre la lecture des images (public)
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
CREATE POLICY "Public view product images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');