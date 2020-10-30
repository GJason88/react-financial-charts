import React from "react";
import CanvasJSReact from '../canvasjs.stock.react';

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
          text: this.props.instrument
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
          minimum: this.props.minDate,
          maximum: this.props.maxDate
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