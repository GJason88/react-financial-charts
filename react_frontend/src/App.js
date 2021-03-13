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
  const [granularity, setGranularity] = useState("day");

  // Connect to polygon websocket on didmount
  useEffect(function() {
    socket.onmessage = (e) => {
      console.log(`Message: Data received from server: ${e.data}`);
    };
    socket.onopen = (e) => {
      socket.send(JSON.stringify(auth));
      socket.send(JSON.stringify({"action":"subscribe","quotes":["MSFT"]}));
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
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({action:"subscribe", "quotes":[instrument]}));
    initializeChart();
  }, [instrument]);

  // Handler function for 
  function changeInstrument(cur) {
    if (socket.readyState === WebSocket.OPEN) {
      // Disconnect from current instrument
      socket.send(JSON.stringify({action:"unsubscribe", "quotes":[instrument]}));
      // Log unsubscribe message
      socket.onmessage = (e) => {
        console.log(e.data);
      };
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

  return (
    <div className="app">
      <header><Header inst={instrument} /></header>
      <main>
        <Instruments defaultInstrument={instrument} changeHandler={changeInstrument} />
        <Chart data={data} instrument={instrument} />
      </main>
    </div>
  );
}