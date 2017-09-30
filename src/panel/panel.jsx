import React from "react";

import StopList from "./list.jsx";

function Panel(props) {
  return (
    <div>
      <StopList stops={ props.stops } port={ props.port }/>
      <p id="addRow">
        <a target="_blank" href={browser.extension.getURL("lookup/lookup.html")}>Add</a>
      </p>
    </div>
  );
}

export default Panel;
