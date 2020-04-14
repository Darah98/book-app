'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.get('/hello', (req, res) => {
  res.status(200).send('Temporary Route');
});
app.get('/', (req, res) => {
  let SQL = 'SELECT * FROM books;';
  return client.query(SQL).then((results) => {
    res.render('pages/index', { booklist: results.rows });
  });
});
app.get('/search', (req, res) => {
  res.render('pages/searches/new');
});
app.post('/add', saveBook);

app.get('/books/:id', (req, res) => {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let safeValues = [req.params.id];
  // bookCategory();

  return client.query(SQL, safeValues).then((results) => {
    let SQL2 = 'SELECT DISTINCT bookshelf FROM books;';
    return client.query(SQL2).then((results2) => {
      res.render('pages/books/details', {
        details: results.rows[0],
        details2: results2.rows,
      });
    });
  });
});
app.post('/result', (req, res) => {
  let search = req.body.keyword;  
  let url = `https://www.googleapis.com/books/v1/volumes?q=${search}`;
  if (req.body.optiontitle) {
    url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search}`;
  } else if (req.body.optionauthor) {
    url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search}`;
  }
  superagent.get(url).then((data) => {
    let bookArr = data.body.items.map((detail) => {
      const bookData = new Book(detail);
      return bookData;
    });
    res.render('pages/searches/show', { book: bookArr });
  });
});

function saveBook(req, res) {
  // console.log(req.body);
  // let bookshelf_cat= req.body.bookshelf;
  // console.log(bookshelf_cat);
  let { img, title, author, description, isbn, bookshelf } = req.body;
  let bookID = req.params.id;
  let SQL =
    'INSERT INTO books (img, title, author, description, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  let safeValues = [img, title, author, description, isbn, bookshelf];
  // bookCategory();
  console.log(safeValues);

  return client.query(SQL, safeValues).then(() => {
    res.redirect('/');
  }).catch(error=>{
    console.log(error);
  })

}
function bookCategory() {
  // let cat= req.body.bookshelf;
  // let SQL= 'INSERT INTO categories VALUES $1;';
  // let val= [cat];
  let SQL = 'SELECT bookshelf FROM books;';
}
// app.get('/books/:id', (req, res)=>{
//     let SQL= 'SELECT DISTINCT bookshelf FROM books;';
//     return   client.query(SQL)
//     .then(results=>{
//         res.render('pages/books/details', {categories: results.rows[0]});
//     })
// })
``
app.put('/update/:id', (req, res) => {
  let { title, author, description, isbn, bookshelf } = req.body;
  let id = req.params.id;
  let SQL =
    'UPDATE books SET title=$1, author=$2, description=$3, isbn=$4, bookshelf=$5 WHERE id=$6';
  let safeValues = [title, author, description, isbn, bookshelf, id];
  return client.query(SQL, safeValues).then((results) => {
    res.redirect('/');
  });
});
// console.log('value');

app.put('/delete/:id', (req, res)=>{
  let SQL= 'DELETE FROM books WHERE id=$1;';
  let value= [req.params.id];
  // console.log('value');
  return client.query(SQL, value)
  .then(res.redirect('/'))
})

function Book(detail) {
  this.imgUrl = detail.volumeInfo.imageLinks || {thumbnail: 'https://img.pngio.com/free-photo-book-cover-empty-book-isolated-max-pixel-book-cover-png-543_720.png'};
  this.title = detail.volumeInfo.title || 'No Title';
  this.author = detail.volumeInfo.authors || 'No Author Name';
  this.description = detail.volumeInfo.description || 'No Description';
  this.bookshelf = detail.volumeInfo.categories || 'No Bookshelf';
  this.isbn = detail.volumeInfo.industryIdentifiers[0].identifier ? detail.volumeInfo.industryIdentifiers[0].identifier : 'No ISBN';
}

app.get('*', (req, res) => {
  res.status(404).send('Oops, something went wrong!');
});
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening of PORT ${PORT}`);
  });
});
