DROP TABLE IF EXISTS book_saver;

CREATE TABLE book_saver (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255),
  category VARCHAR(255)
)