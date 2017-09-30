import React from "react";

import Time from "../shared/time.jsx";

function Arrival(props) {
  return (
    <td className="arrival">
      <Time estimated={ props.arrival.estimated } scheduled={ props.arrival.scheduled } />
    </td>
  );
}

export default Arrival;
