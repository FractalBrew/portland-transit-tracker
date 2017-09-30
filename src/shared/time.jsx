import React from "react";

class Time extends React.Component {
  render() {
    let estimated = !!this.props.estimated;
    let time = estimated ? this.props.estimated : this.props.scheduled;
    let mins = Math.floor((time - Date.now()) / 60000);

    return (<span>{ mins }mins</span>);
  }
}

export default Time;
