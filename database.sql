-- SpendR v2 - Database Export
-- Subject: Internet Programming

-- USERS TABLE
CREATE TABLE users (
  id         bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       text        NOT NULL,
  email      text        NOT NULL UNIQUE,
  password   text        NOT NULL,
  role       text        NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- EXPENSES TABLE
CREATE TABLE expenses (
  id         bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id    bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  amount     numeric     NOT NULL,
  category   text        NOT NULL,
  date       date        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- USER ACTIVITY TABLE
CREATE TABLE user_activity (
  id          bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id     bigint      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action      text        NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now()
);