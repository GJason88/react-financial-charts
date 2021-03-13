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
    let curDate = new Date();
    let startDate = getStartDate(curDate, req.query.granularity, 1000);
    if (startDate) {
      fetch("https://data.alpaca.markets/v2/stocks/" + req.query.instrument + "/bars?start=2021-01-01T13:00:00Z&end=" + curDate.toISOString() + "&timeframe=" + req.query.granularity, {headers:headers})
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        res.json(response);
      })
      .catch(() => res.send("Alpaca API Error"));
    }
    else {
      res.send("Error: invalid granularity");
    }
  } else {
    res.send("Error: must provide instrument and granularity");
  }
});

// Gets start date a given number of units away from current date
function getStartDate(curDate, granularity, num) {
  let numMins = num*60000;
  let numHours = numMinutes*60;
  let numDays = numHours*24;
  if (granularity === "1Min") {
    return new Date(curDate.getTime() - numMinutes);
  }
  else if (granularity === "1Hour") {
    return new Date(curDate.getTime() - numHours);
  }
  else if (granularity === "1Day") {
  }
  return null;
}

module.exports = router;
