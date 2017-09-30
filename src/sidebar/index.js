import React from "react";
import ReactDOM from "react-dom";

import Sidebar from "./sidebar.jsx";

const port = browser.runtime.connect(null, { name: "sidebar" });
const app = document.getElementById("app");

port.onMessage.addListener((message) => {
  if (message.message == "arrivals") {
    ReactDOM.render(<Sidebar stops={ message.data } port={ port }/>, app);
  }
});

ReactDOM.render(<Sidebar stops={ [] } port={ port }/>, app);
