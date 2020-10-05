import React from "react";

function Instruments(props) {
    var changeInstrument = props.changeHandler;

    return (
        <div>
            <select id="instruments" defaultValue={props.defaultInstrument} onChange={(e) => changeInstrument(e.target.value)} size="2">
                <option>MSFT</option>
                <option>AAPL</option>
                <option>TSLA</option>
            </select>
        </div>
    )
}

export default Instruments