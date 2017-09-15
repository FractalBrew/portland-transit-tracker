import React from "react";
import ReactDOM from "react-dom";

import port from "./port.js";
import StopList from "./list.jsx";

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stops: [] };

    this.addStop = this.addStop.bind(this);

    port.onMessage.addListener((message) => {
      if (message.message == "arrivals") {
        this.setState({
          stops: message.data,
        });
      }
    });
  }

  addStop() {
    // XXX Should be using refs or something
    let stop = document.getElementById("stop").value;
    if (stop && parseInt(stop).toString() == stop) {
      port.postMessage({
        message: "addStop",
        data: parseInt(stop),
      });

      document.getElementById("stop").value = "";
    }
  }

  render() {
    return (
      <div>
        <StopList stops={this.state.stops}/>
        <p id="addRow">
          <a href="http://trimet.org/#/tracker/line/">Lookup</a>
          <label><input type="text" id="stop" /></label>
          <button id="addButton" type="button" onClick={this.addStop}>Add Stop</button>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Panel/>, document.getElementById("app"));
