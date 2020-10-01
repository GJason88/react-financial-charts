import React from "react";
import CanvasJSReact from '../canvasjs.stock.react';
import sampleData from "./data/sample-data";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Chart extends React.Component {
  render() {
    const containerProps = {
      width: "80%",
      height: "600px",
      margin: "auto"
    };
    const options = {
      title: {
          text: "Financial Charts"
      },
      charts: [{
          data: [{
            type: "candlestick",
            risingColor: "#97ff8a",
            color: "#ff8a8c",
            dataPoints: this.props.data
          }]
      }],
      navigator: {
        slider: {
          minimum: new Date("2012-01-01"),
          maximum: new Date("2012-01-23")
        }
      }
    };
    return (
      <div>
          <CanvasJSStockChart options={options} containerProps={containerProps} />
      </div>
  )
  }
}

export default Chart;