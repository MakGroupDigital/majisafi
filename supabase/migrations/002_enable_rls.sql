-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE depots ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Clients RLS - Users can only see themselves
CREATE POLICY "Clients can view own record"
  ON clients FOR SELECT
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Clients can update own record"
  ON clients FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Depots RLS - Managers can only see their depot
CREATE POLICY "Managers can view their depot"
  ON depots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('manager', 'admin')
    AND users.depot_id = depots.id
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Stock Items RLS - Managers can only see their depot stock
CREATE POLICY "Managers can view their depot stock"
  ON stock_items FOR SELECT
  USING (depot_id IN (
    SELECT depot_id FROM users WHERE users.id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Managers can update their depot stock"
  ON stock_items FOR UPDATE
  USING (depot_id IN (
    SELECT depot_id FROM users WHERE users.id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Sales RLS - Users can only see their sales
CREATE POLICY "Managers can view their depot sales"
  ON sales FOR SELECT
  USING (depot_id IN (
    SELECT depot_id FROM users WHERE users.id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Sale Items RLS - Inherited from sales
CREATE POLICY "Users can view sale items from their sales"
  ON sale_items FOR SELECT
  USING (sale_id IN (
    SELECT sales.id FROM sales 
    WHERE sales.depot_id IN (
      SELECT depot_id FROM users WHERE users.id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  ));

-- Users RLS - Users can manage their own profile, admins manage all
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users AS u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));
