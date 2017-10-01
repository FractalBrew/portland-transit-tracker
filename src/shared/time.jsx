import React from "react";

function Time(props) {
  let estimated = !!props.estimated;
  let time = estimated ? props.estimated : props.scheduled;
  let mins = Math.floor((time - Date.now()) / 60000);
  let className = estimated ? "estimated" : "scheduled";

  return (<span className={ className }>{ mins }mins</span>);
}

export default Time;
