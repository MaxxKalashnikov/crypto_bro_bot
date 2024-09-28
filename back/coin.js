const express = require('express');
require('dotenv').config()

const api = process.env.COINGECKO_API_KEY;
const coinRouter = express.Router();

coinRouter.get('/', async (request, response) => {
    try{
        response.status(200).json("hi")
    }catch(error){
        response.statusMessage = error;
        response.status(500).json({error: error})
    }
});

coinRouter.get('/get', async (request, response) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
    const options = { 
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': api}
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        console.log(data)
        response.status(200).json(data);
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
});

coinRouter.get('/getlist', async (request, response) => {
    const url = `https://api.coingecko.com/api/v3/coins/list`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        response.status(200).json(data);
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
});

coinRouter.get('/getbyname/:searchToken', async (request, response) => {
    let searchToken = request.params.searchToken.trim()

    const url = `https://api.coingecko.com/api/v3/search?query=${searchToken}`;
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': api}
    };
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        response.status(200).json(data);
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
});

coinRouter.get('/getcoindata/:coindId', async (request, response) => {
    let coindId = request.params.coindId.trim()

    const url = `https://api.coingecko.com/api/v3/coins/${coindId}`;
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': api}
    };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        response.status(200).json(data);
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
});

coinRouter.get('/getlist', async (request, response) => {
    const url = `https://api.coingecko.com/api/v3/coins/list`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const res = await fetch(url, options);
        const data = await res.json();
        response.status(200).json(data);
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
});

coinRouter.get('/getmarketcap', async (req, res) =>{
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': api}
    };

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        console.error("Error connecting to API:", error);
        response.status(500).json({ error: error.message });
    }
})

module.exports = {coinRouter};