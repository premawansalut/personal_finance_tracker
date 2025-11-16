-- 001-init.sql

-- enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- incomes table
CREATE TABLE IF NOT EXISTS incomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(64) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- allowed categories for reference
CREATE TABLE IF NOT EXISTS income_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL
);

-- seed categories
INSERT INTO income_categories (name) VALUES
  ('Salary'),
  ('Invest'),
  ('Business'),
  ('Interest'),
  ('Extra Income'),
  ('Other')
ON CONFLICT (name) DO NOTHING;
