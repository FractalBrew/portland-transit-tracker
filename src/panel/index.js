import React from "react";
import ReactDOM from "react-dom";

import Panel from "./panel.jsx";

const port = browser.runtime.connect(null, { name: "panel" });
const app = document.getElementById("app");

port.onMessage.addListener((message) => {
  if (message.message == "arrivals") {
    ReactDOM.render(<Panel stops={ message.data } port={ port }/>, app);
  }
});

ReactDOM.render(<Panel stops={ [] } port={ port }/>, document.getElementById("app"));
