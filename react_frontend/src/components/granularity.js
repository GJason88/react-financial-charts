import React from 'react';

function Granularity(props) {
    let changeGranularity = props.changeHandler;
    return (
        <div>
            <select id="granularity" defaultValue={props.curGranularity} onChange={(e) => changeGranularity(e.target.value)} size="1">
                <option value="1Min">1 Minute</option>
                <option value="5Min">5 Minutes</option>
                <option value="15Min">15 Minutes</option>
                <option value="day">1 Day</option>
            </select>
        </div>
    )
}

export default Granularity;