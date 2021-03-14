import React, { useState, useEffect } from 'react';
import Chart from "./components/chart"
import Header from "./components/header"
import Instruments from "./components/instruments"
import './App.css';
import sampleData from './components/data/sample-data';

require('dotenv').config();
const socket = new WebSocket("wss://stream.data.alpaca.markets/v2/iex");
const auth = {
  "action": "auth", 
  "key": process.env.REACT_APP_API_KEY, 
  "secret": process.env.REACT_APP_SECRET_API_KEY
};

export default function App() {
  const [data, setData] = useState([]);
  const [instrument, setInstrument] = useState("MSFT");
  const [granularity, setGranularity] = useState("1Min");

  // Set up websocket listeners on didmount
  useEffect(function() {
    socket.onmessage = (e) => {
      dataObject = JSON.parse(e.data)[0] // comes in as a json string
      if (dataObject.T === "b") { // only update chart data if new message is a bar "b" update
        updateChart(dataObject);
      }
      console.log(`Message: Data received from server: ${e.data}`);
    };
    socket.onopen = (e) => {
      socket.send(JSON.stringify(auth));
      socket.send(JSON.stringify({"action":"subscribe","bars":[instrument]}));
    };
    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`Close: Connection closed successfully, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('Close: Connection died');
      }
    };
    socket.onerror = function(error) {
      alert(`Error: ${error.message}`);
    };
  }, []);

  // Connect to new instrument websocket when instrument state changes
  useEffect(function() {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({action:"subscribe", "bars":[instrument]}));
    initializeChart();
  }, [instrument]);

  // Handler function for 
  function changeInstrument(cur) {
    if (socket.readyState === WebSocket.OPEN) {
      // Disconnect from current instrument
      socket.send(JSON.stringify({action:"unsubscribe", "bars":[instrument]}));
    }
    setInstrument(cur);
  }

  // Fetch first 1000 candlesticks for default granularity and instrument
  function initializeChart() {
    fetch("/getBars?instrument=" + instrument + "&granularity=" + granularity)
    .then(promise => promise.json())
    .then(res => {
      // Reformat data to fit into canvasJS chart settings
      let reformattedData = [];
      let candlesticks = res[instrument];
      for (let candlestick of candlesticks) {
        reformattedData.push({
          x: new Date(candlestick.t*1000),
          y: [candlestick.o, candlestick.h, candlestick.l, candlestick.c]
        });
      }
      setData(reformattedData);
    });
  }

  function updateChart() {
    // TODO
  }

  return (
    <div className="app">
      <header><Header inst={instrument} /></header>
      <main>
        <Instruments defaultInstrument={instrument} changeHandler={changeInstrument} />
        <Chart data={data} instrument={instrument} dateFormat={granularity === "day" ? "MM/DD/YY" : "MM/DD/YY H:mm"} />
      </main>
    </div>
  );
}