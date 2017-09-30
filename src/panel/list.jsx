import React from "react";

import Stop from "./stop.jsx";

function StopList(props) {
  return (
    <table>
      <tbody>
        {props.stops.map((stop, i) =>
          <Stop key={i} stop={stop} port={props.port}/>
        )}
      </tbody>
    </table>
  );
}

export default StopList;
