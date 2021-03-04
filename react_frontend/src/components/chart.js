import React from "react";
import CanvasJSReact from '../canvasjs.stock.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export default function Chart(props) {
  const containerProps = {
    width: "80%",
    height: "600px",
    margin: "auto"
  };
  const options = {
    title: {
        text: props.instrument
    },
    charts: [{
        data: [{
          type: "candlestick",
          risingColor: "#97ff8a",
          color: "#ff8a8c",
          dataPoints: props.data
        }]
    }],
    navigator: {
      slider: {
        minimum: props.minDate,
        maximum: props.maxDate
      }
    }
  };
  return (
    <div>
        <CanvasJSStockChart options={options} containerProps={containerProps} />
    </div>
  )
}