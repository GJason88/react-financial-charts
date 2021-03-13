require('dotenv').config({ path: 'C:\\Users\\Jason\\Desktop\\react-financial-charts\\.env' });

var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

const headers = {
  'APCA-API-KEY-ID': process.env.API_KEY,
  'APCA-API-SECRET-KEY': process.env.SECRET_API_KEY
}

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.instrument && req.query.granularity) {
    fetch("https://data.alpaca.markets/v1/bars/" + req.query.granularity + "?limit=500&symbols=" + req.query.instrument, {headers:headers})
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      res.json(response);
    })
    .catch(() => res.send("Alpaca API Error"));
  } else {
    res.send("Error: must provide instrument and granularity");
  }
});

module.exports = router;
