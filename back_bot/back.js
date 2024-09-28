require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { coinRouter } = require('./coin.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:  false}))
app.use('/', coinRouter);
const port = process.env.PORT;

const url = `https://api.coingecko.com/api/v3/ping`;
const options = { method: 'GET', headers: { accept: 'application/json' } };

fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))    
    .catch(err => console.error('error:' + err));

app.listen(port);