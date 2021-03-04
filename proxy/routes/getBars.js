require('dotenv').config({ path: 'C:\\Users\\Jason\\Desktop\\react-financial-charts\\.env' });

var express = require('express');
var router = express.Router();

const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
  keyId: process.env.API_KEY,
  secretKey: process.env.SECRET_API_KEY,
  paper: false,
  usePolygon: false
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  alpaca.getBars('1Min', ['AAPL'], {limit: 5}).then((response) => {
    res.json(response);
  });
});

module.exports = router;
