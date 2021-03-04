require('dotenv').config({ path: 'C:\\Users\\Jason\\Desktop\\react-financial-charts\\.env' });
const express = require('express');
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
    keyId: process.env.API_KEY,
    secretKey: process.env.SECRET_API_KEY,
    paper: false,
    usePolygon: false
});

const app = express();
const port = 3001;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/', (req, res) => {
    alpaca.getBars('1Min', ['AAPL'], {limit: 5}).then((response) => {
        res.send(response);
    });
});

app.listen(port, () => console.log('http://localhost:' + port));