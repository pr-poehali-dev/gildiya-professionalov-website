
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Менеджер',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  client TEXT NOT NULL,
  service TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  author TEXT NOT NULL,
  comment TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  client TEXT NOT NULL,
  service TEXT NOT NULL,
  amount TEXT NOT NULL,
  signed_at DATE NOT NULL,
  expires_at DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
