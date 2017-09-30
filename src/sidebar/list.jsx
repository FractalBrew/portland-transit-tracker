import React from "react";

import Stop from "./stop.jsx";

function StopList(props) {
  return (
    <table>
      {props.stops.map((stop, i) =>
        <Stop key={i} stop={stop} port={props.port}/>
      )}
    </table>
  );
}

export default StopList;
