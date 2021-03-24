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
    axisX: {
      crosshair: {
          enabled: true
      }
    },
    charts: [{
        data: [{
          type: "candlestick",
          xValueFormatString: props.dateFormat,
          risingColor: "#97ff8a",
          color: "#ff8a8c",
          dataPoints: props.data
        }]
    }]
  };
  return (
    <div>
      <CanvasJSStockChart options={options} containerProps={containerProps} />
    </div>
  )
}