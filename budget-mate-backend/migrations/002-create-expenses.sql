-- 002-create-expenses.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(64) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL
);

INSERT INTO expense_categories (name) VALUES
  ('Food'),
  ('Social'),
  ('Traffic'),
  ('Shopping'),
  ('Grocery'),
  ('Education'),
  ('Bills'),
  ('Rental'),
  ('Medical'),
  ('Investment'),
  ('Gift'),
  ('Other')
ON CONFLICT (name) DO NOTHING;
