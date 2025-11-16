CREATE TABLE IF NOT EXISTS token_blacklist (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  blacklisted_at TIMESTAMP DEFAULT now()
);
