import React from "react";
import { expect } from "chai";
import { shallow } from "./utils";

import Time from "../src/shared/time.jsx";

describe("Time component", function() {
  it("Should display an estimated time", function() {
    const now = Date.now();
    const next = now + 90000;

    let wrapper = shallow(<Time estimated={next} scheduled={now} />);
    expect(wrapper.find("span").first().html()).to.equal("<span class=\"estimated\">1mins</span>");
  });

  it("Should display a scheduled time", function() {
    const now = Date.now();
    const nextnext = now + 130000;

    let wrapper = shallow(<Time estimated={null} scheduled={nextnext} />);
    expect(wrapper.find("span").first().html()).to.equal("<span class=\"scheduled\">2mins</span>");
  });
});
