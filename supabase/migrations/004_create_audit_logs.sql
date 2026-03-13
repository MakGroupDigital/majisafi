-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_email VARCHAR(255),
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('CREATE', 'READ', 'UPDATE', 'DELETE')),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('product', 'client', 'depot', 'stock', 'sale', 'sale_item', 'user')),
  entity_id UUID,
  entity_name VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_action ON audit_logs(admin_id, action_type, created_at DESC);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can insert audit logs (logged in admins only in practice)
CREATE POLICY "Admins can insert audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can view audit logs (simplified policy)
CREATE POLICY "Authenticated users can view audit logs" ON audit_logs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- No one can delete audit logs (immutable)
CREATE POLICY "No delete on audit logs" ON audit_logs
  FOR DELETE
  USING (false);

-- No one can update audit logs (immutable)
CREATE POLICY "No update on audit logs" ON audit_logs
  FOR UPDATE
  USING (false);
