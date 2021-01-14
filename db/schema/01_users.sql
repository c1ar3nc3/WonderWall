-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users
CASCADE;
CREATE TABLE users
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  city VARCHAR(255),
  gender VARCHAR(255),
  profile_picture TEXT DEFAULT 'https://i.pinimg.com/236x/74/81/a7/7481a797bb6ef4083ede2e60f47a95cd.jpg'
);
