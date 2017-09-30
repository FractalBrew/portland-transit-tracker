import React from "react";
import { expect } from "chai";
import { shallow } from "./utils";

import Stop from "../src/panel/stop.jsx";

describe("Panel Stop component", function() {
  it("Should display a stop", function() {
    const stop = {
      routeName: "route",
      stopName: "stop",
      arrivals: [{
        estimated: 5,
        scheduled: 6
      }],
    };

    let wrapper = shallow(<Stop stop={stop} />);
    expect(wrapper.find(".routeName").html()).to.equal("<p class=\"routeName\">route</p>");
    expect(wrapper.find(".stopName").html()).to.equal("<p class=\"stopName\">stop</p>");
    expect(wrapper.find("td")).to.have.length(4);
    expect(wrapper.find("Arrival")).to.have.length(1);
    expect(wrapper.find("Arrival").first().prop("arrival")).to.deep.equal({ estimated: 5, scheduled: 6 });
  });
});
