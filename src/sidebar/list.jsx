import React from "react";

import Stop from "./stop.jsx";

class StopList extends React.Component {
  render() {
    return (
      <table>
        {this.props.stops.map((stop) =>
          <Stop key={stop.id} stop={stop} port={this.props.port}/>
        )}
      </table>
    );
  }
}

export default StopList;
