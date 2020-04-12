'use strict';

require('dotenv').config();

const express= require('express');
const app= express();
const PORT= process.env.PORT || 3030;
const superagent= require('superagent');

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/hello', (req, res)=>{
    res.status(200).send('Temporary Route');
})
app.get('/', (req, res)=>{
    res.render('pages/index');
})
app.get('/searches/new', (req, res)=> {
    res.render('pages/searches/new');
})
// app.post('/title', (req, res)=>{
//     let bookArr= [];
//     let search= req.body.title;
//     const url= `https://www.googleapis.com/books/v1/volumes?q=${search}`
//     superagent.get(url)
//     .then(data=>{
//         // console.log('----------- ------', data.body);
//         data.body.items.forEach(val=>{
//             const bookData= new Book(
//                 val.volumeInfo.imageLinks.thumbnail,
//                 val.volumeInfo.title, 
//                 val.volumeInfo.authors, 
//                 val.volumeInfo.description);
//             bookArr.push(bookData);
//         });
//         res.redirect('pages/searches/show', {book: bookArr});
//     })
// })
app.get('/result', (req, res)=>{
    let search= req.query.title;
    const url= `https://www.googleapis.com/books/v1/volumes?q=${search}`
    superagent.get(url)
    .then(data=>{
        res.render('pages/searches/show', {book: data.body.items});
    })
})

// app.get('/author', (req, res)=>{
//     let search= req.query.author;
//     const url= `https://www.googleapis.com/books/v1/volumes?q=${search}`
//     superagent.get(url)
//     .then(data=>{
//         res.render('pages/searches/show', {book: data.body.items});
//     })
// })

function Book(imgUrl, title, author, description){
    this.imgUrl= imgUrl;
    this.title= title;
    this.author= author;
    this.description= description;
}


app.get('*', (req, res)=>{
    res.status(404).send('Oops, something went wrong!')
})
app.listen(PORT, ()=>{
    console.log(`Listening of PORT ${PORT}`);
})