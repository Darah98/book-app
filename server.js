'use strict';

require('dotenv').config();

const express= require('express');
const app= express();
const PORT= process.env.PORT || 3030;
const superagent= require('superagent');
const pg= require('pg');
const client= new pg.Client(process.env.DATABASE_URL);

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.get('/hello', (req, res)=>{
    res.status(200).send('Temporary Route');
})
app.get('/', (req, res)=>{
    let SQL= 'SELECT * FROM books;';
    return client.query(SQL)
    .then(results=>{
        res.render('pages/index', {booklist: results.rows});
    })
})
app.get('/search', (req, res)=> {
    res.render('pages/searches/new');
})
app.post('/add', saveBook);

app.get('/books/:id', (req, res)=>{
    let SQL= 'SELECT * FROM books WHERE id=$1;';
    let safeValues= [req.params.id];
    return client.query(SQL, safeValues)
    .then(results=>{
        res.render('pages/books/details', {details: results.rows[0]});
    })
})
app.post('/result', (req, res)=>{
    let search= req.body.keyword;
    let url= `https://www.googleapis.com/books/v1/volumes?q=${search}`;
    if(req.body.optiontitle){
        url= `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search}`
    } else if(req.body.optionauthor){
        url= `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search}`
    }
    superagent.get(url)
    .then(data=>{
        let bookArr= data.body.items.map(detail=>{
            const bookData= new Book(detail);
            return bookData;
        })
        res.render('pages/searches/show', {book: bookArr});
    })
})
    
function saveBook(req, res){
    // console.log(req.body);
    let {img, title, author, description, isbn, bookshelf}= req.body;
    let SQL= 'INSERT INTO books (img, title, author, description, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
    let safeValues= [img, title, author, description, isbn, bookshelf];
    return client.query(SQL, safeValues)
    .then(()=>{
        res.redirect('/');
    })
}

function Book(detail){
    this.imgUrl= detail.volumeInfo.imageLinks.thumbnail || '../bookcover.jpg';
    this.title= detail.volumeInfo.title || 'No Title';
    this.author= detail.volumeInfo.authors || 'No Author Name';
    this.description= detail.volumeInfo.description || 'No Description';
    this.bookshelf= detail.volumeInfo.categories || 'No Bookshelf';
    this.isbn= detail.volumeInfo.industryIdentifiers[0].identifier || 'No ISBN';
}

app.get('*', (req, res)=>{
    res.status(404).send('Oops, something went wrong!')
})
client.connect()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Listening of PORT ${PORT}`);
    })
})