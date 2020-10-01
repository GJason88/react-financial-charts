import React from 'react';
import Chart from "./components/chart"
import Header from "./components/header"
import Instruments from "./components/instruments"
import './App.css';
import sampleData from './components/data/sample-data';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: sampleData
    }
  }

  // update data when new pricing data comes in to cause a rerender of chart with updated data
  updateData() {
    
  }

  render() {
    return (
    <div className="app">
      <header><Header /></header>
      <main>
        <Instruments />
        <Chart data={this.state.data} />
      </main>
    </div>
  );
  }
}

export default App;
