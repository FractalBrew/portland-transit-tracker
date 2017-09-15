import React from "react";

import Stop from "./stop.jsx";

class StopList extends React.Component {
  render() {
    return (
      <table>
        <tbody>
          {this.props.stops.map((stop) =>
            <Stop key={stop.id} stop={stop} port={this.props.port}/>
          )}
        </tbody>
      </table>
    );
  }
}

export default StopList;
