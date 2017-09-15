import React from "react";

import Stop from "./stop.jsx";

class StopList extends React.Component {
  render() {
    return (
      <table>
        {this.props.stops.map((stop, i) =>
          <Stop key={i} stop={stop} port={this.props.port}/>
        )}
      </table>
    );
  }
}

export default StopList;
