DROP SCHEMA IF EXISTS desafio_xpi;
CREATE SCHEMA IF NOT EXISTS desafio_xpi;

CREATE TABLE desafio_xpi.clients (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE desafio_xpi.accounts (
  id INTEGER PRIMARY KEY NOT NULL,
  balance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  investments DECIMAL(18,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE desafio_xpi.transaction_type (
  id INTEGER PRIMARY KEY NOT NULL,
  type VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE desafio_xpi.transaction_history (
  id SERIAL PRIMARY KEY NOT NULL,
  account_id INTEGER UNIQUE NOT NULL,
  type_id INTEGER UNIQUE NOT NULL,

  FOREIGN KEY (account_id) REFERENCES desafio_xpi.accounts(id),
  FOREIGN KEY (type_id) REFERENCES desafio_xpi.transaction_type(id)
);

CREATE TABLE desafio_xpi.assets (
  id SERIAL PRIMARY KEY NOT NULL,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(18,2) NOT NULL
);

CREATE TABLE desafio_xpi.investment_type (
  id INTEGER PRIMARY KEY NOT NULL,
  type VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE desafio_xpi.account_assets (
  id SERIAL NOT NULL,
  asset_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  type_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(18,2) NOT NULL,
  date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id, asset_id, account_id),
  FOREIGN KEY (asset_id) REFERENCES desafio_xpi.assets(id),
  FOREIGN KEY (account_id) REFERENCES desafio_xpi.accounts(id),
  FOREIGN KEY (type_id) REFERENCES desafio_xpi.investment_type(id)
);