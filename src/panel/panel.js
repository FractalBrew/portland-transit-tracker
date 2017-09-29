import React from "react";
import ReactDOM from "react-dom";

import StopList from "./list.jsx";

const port = browser.runtime.connect(null, { name: "panel" });

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { stops: [] };

    port.onMessage.addListener((message) => {
      if (message.message == "arrivals") {
        this.setState({
          stops: message.data,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <StopList stops={this.state.stops} port={port}/>
        <p id="addRow">
          <a target="_blank" href={browser.extension.getURL("lookup/lookup.html")}>Add</a>
        </p>
      </div>
    );
  }
}

ReactDOM.render(<Panel/>, document.getElementById("app"));
