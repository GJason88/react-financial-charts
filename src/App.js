import React, { useState, useEffect } from 'react';
import Chart from "./components/chart"
import Header from "./components/header"
import Instruments from "./components/instruments"
import './App.css';
import sampleData from './components/data/sample-data';
import {auth} from './configs';

const socket = new WebSocket("wss://socket.polygon.io/stocks");

export default function App() {
  const [data, setData] = useState(sampleData);
  const [instrument, setInstrument] = useState("MSFT");
  const [minDate, setMinDate] = useState(new Date("2012-01-01"));
  const [maxDate, setMaxDate] = useState(new Date("2012-01-23"));

  // Connect to polygon websocket on didmount
  useEffect(function() {
    socket.onopen = (e) => {
      console.log("Open: Connection established to Polygon.io Stock Streaming WebSocket");
      socket.send(JSON.stringify(auth));
      socket.send(JSON.stringify({action:"subscribe", params:"T.MSFT"}));
      socket.onmessage = (e) => {
        console.log(`Message: Data received from server: ${e.data}`);
      };
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
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({action:"subscribe", params:"T." + instrument}));
  }, [instrument]);

  // Handler function for 
  function changeInstrument(cur) {
    if (socket.readyState === WebSocket.OPEN) {
      // Disconnect from current instrument
      socket.send(JSON.stringify({action:"unsubscribe", params:"T." + instrument}));
      // Log unsubscribe message
      socket.onmessage = (e) => {
        console.log(e.data);
      };
    }
    setInstrument(cur);
    updateChart();
  }

  function updateChart() {
    
  }

  return (
    <div className="app">
      <header><Header inst={instrument} /></header>
      <main>
        <Instruments defaultInstrument={instrument} changeHandler={changeInstrument} />
        <Chart data={data} instrument={instrument} minDate={minDate} maxDate={maxDate} />
      </main>
    </div>
  );
}