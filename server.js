'use strict';

require('dotenv').config();

const express= require('express');
const app= express();
const PORT= process.env.PORT || 3030;

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/hello', (req, res)=>{
    res.status(200).send('Temporary Route');
})
app.get('/', (req, res)=>{
    res.render('pages/index');
})
app.get('/searches/new', (req, res)=> {
    res.render('pages/searches/new');
})



app.get('*', (req, res)=>{
    res.status(404).send('Oops, something went wrong!')
})
app.listen(PORT, ()=>{
    console.log(`Listening of PORT ${PORT}`);
})