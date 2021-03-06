-- Drop and recreate Pots table

DROP TABLE IF EXISTS posts
CASCADE;
CREATE TABLE posts
(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  post_description TEXT,
  url_address TEXT,
  date_created DATE DEFAULT NOW()
  ::date,
  image_url TEXT DEFAULT 'https://i.pinimg.com/564x/3a/92/6b/3a926bda762ba2024d76713182d316bc.jpg',
  category_id INTEGER REFERENCES post_categories
  (id) ON
  DELETE CASCADE
);
