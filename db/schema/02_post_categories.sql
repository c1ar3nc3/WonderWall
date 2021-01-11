DROP TABLE IF EXISTS post_categories CASCADE;

CREATE TABLE post_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(255)
);
