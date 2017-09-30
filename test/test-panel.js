import React from "react";
import { expect } from "chai";
import { shallow } from "./utils";
import sinon from "sinon";

import Stop from "../src/panel/stop.jsx";

describe("Panel Stop component", function() {
  it("Should display a stop", function() {
    const stop = {
      routeName: "route",
      stopName: "stop",
      arrivals: [{
        estimated: 5,
        scheduled: 6,
      }],
    };

    let wrapper = shallow(<Stop stop={stop} />);
    expect(wrapper.find(".routeName").html()).to.equal("<p class=\"routeName\">route</p>");
    expect(wrapper.find(".stopName").html()).to.equal("<p class=\"stopName\">stop</p>");
    expect(wrapper.find("td")).to.have.length(4);
    expect(wrapper.find("Arrival")).to.have.length(1);
    expect(wrapper.find("Arrival").first().prop("arrival")).to.deep.equal({ estimated: 5, scheduled: 6 });

    stop.arrivals.push({
      estimated: null,
      scheduled: 7,
    });

    wrapper = shallow(<Stop stop={stop} />);
    expect(wrapper.find(".routeName").html()).to.equal("<p class=\"routeName\">route</p>");
    expect(wrapper.find(".stopName").html()).to.equal("<p class=\"stopName\">stop</p>");
    expect(wrapper.find("td")).to.have.length(3);
    expect(wrapper.find("Arrival")).to.have.length(2);
    expect(wrapper.find("Arrival").first().prop("arrival")).to.deep.equal({ estimated: 5, scheduled: 6 });
    expect(wrapper.find("Arrival").at(1).prop("arrival")).to.deep.equal({ estimated: null, scheduled: 7 });
  });

  it("Clicking remove should send a message", function() {
    const port = {
      postMessage: sinon.spy(),
    };

    const stop = {
      route: 5,
      routeName: "route",
      direction: 7,
      stop: 10,
      stopName: "stop",
      arrivals: [{
        estimated: 5,
        scheduled: 6,
      }],
    };

    let wrapper = shallow(<Stop port={port} stop={stop} />);
    wrapper.find(".delete").simulate("click");
    expect(port.postMessage.calledOnce).to.be.true;
    expect(port.postMessage.args[0][0]).to.deep.equal({
      message: "removeStop",
      data: {
        route: 5,
        direction: 7,
        stop: 10,
      },
    });
  });
});
