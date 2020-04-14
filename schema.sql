DROP TABLE IF EXISTS books;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    img VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
);

INSERT INTO books (img, title, author, description, isbn, bookshelf) VALUES ('../bookcover.jpg', 'some book', 'some author', 'some description', '516512', 'some category');

-- CREATE TABLE categories(
--     category VARCHAR(255)
-- );