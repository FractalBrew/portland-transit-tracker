import React from "react";

class Arrival extends React.Component {
  render() {
    let estimated = !!this.props.arrival.estimated;
    let time = estimated ? this.props.arrival.estimated : this.props.arrival.scheduled;
    let mins = Math.floor((time - Date.now()) / 60000);

    return (
      <td className="arrival"><span>{mins}mins</span></td>
    );
  }
}

export default Arrival;
