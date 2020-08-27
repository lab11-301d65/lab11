DROP TABLE IF EXISTS book_saver;

CREATE TABLE book_saver (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  category VARCHAR(255)
)