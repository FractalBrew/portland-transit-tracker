import React from "react";

import port from "./port.js";
import Arrival from "./arrival.jsx";

class Stop extends React.Component {
  constructor(props) {
    super(props);

    this.deleteStop = this.deleteStop.bind(this);
  }

  deleteStop() {
    port.postMessage({
      message: "removeStop",
      data: parseInt(this.props.stop.id),
    });
  }

  render() {
    let arrivals = this.props.stop.arrivals.filter((a, i) => i < 3);
    let blanks = [];
    for (let i = arrivals.length; i < 3; i++) {
      blanks.push(null);
    }

    return (
      <tr>
        <td className="stopName">{this.props.stop.name}</td>
        {arrivals.map((arrival, i) =>
          <Arrival key={i} arrival={arrival}/>
        )}
        {blanks.map((blank, i) =>
          <td></td>
        )}
        <td className="deleteCell">
          <button type="button" className="delete" onClick={this.deleteStop}>X</button>
        </td>
      </tr>
    );
  }
}

export default Stop;
