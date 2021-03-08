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

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.query.instrument && req.query.granularity) {
    alpaca.getBars(req.query.granularity, [req.query.instrument], {limit: 5})
    .then((response) => {
      res.json(response);
    })
    .catch(() => res.send("Alpaca API Error"));
  } else {
    res.send("must provide instrument and granularity");
  }
});

module.exports = router;
