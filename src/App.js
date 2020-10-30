import React from 'react';
import Chart from "./components/chart"
import Header from "./components/header"
import Instruments from "./components/instruments"
import './App.css';
import sampleData from './components/data/sample-data';
import {auth} from './configs';

const socket = new WebSocket("wss://socket.polygon.io/stocks");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: sampleData,
      instrument: "MSFT",
      minDate: (new Date("2012-01-01")),
      maxDate: (new Date("2012-01-23"))

    }
    this.changeInstrument = this.changeInstrument.bind(this);
  }

  componentDidMount() {
    this.handleWebSocket();
  }

  componentDidUpdate() {
    socket.send(JSON.stringify({action:"subscribe", params:"T." + this.state.instrument}));

  }

  // update data when new pricing data comes in to cause a rerender of chart with updated data
  unsubscribe() {
    socket.send(JSON.stringify({action:"unsubscribe", params:"T." + this.state.instrument}));
    socket.onmessage = (e) => {
      console.log(e.data);
    };
  }

  updateChart() {
    
  }

  changeInstrument(cur) {
    this.unsubscribe();
    this.setState({
      instrument: cur
    })
    this.updateChart();
  }

  handleWebSocket() {
    socket.onopen = (e) => {
      console.log("Open: Connection established to Polygon.io Stock Streaming WebSocket");
      socket.send(JSON.stringify(auth));
      socket.send(JSON.stringify({action:"subscribe", params:"T." + this.state.instrument}));
      socket.onmessage = (e) => {
        console.log(`Message: Data received from server: ${e.data}`);
      };
    };
    socket.onclose = function(event) {
      if (event.wasClean) {
        alert(`Close: Connection closed successfully, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('Close: Connection died');
      }
    };
    socket.onerror = function(error) {
      alert(`Error: ${error.message}`);
    };
  }

  render() {
    return (
    <div className="app">
      <header><Header /></header>
      <main>
        <Instruments defaultInstrument={this.state.instrument} changeHandler={this.changeInstrument} />
        <Chart data={this.state.data} instrument={this.state.instrument} minDate={this.state.minDate} maxDate={this.state.maxDate} />
      </main>
    </div>
  );
  }
}

export default App;
