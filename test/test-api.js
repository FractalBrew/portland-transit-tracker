import "isomorphic-fetch";
import fetchMock from "fetch-mock";
import { expect } from "chai";

import { fetchRoutes } from "../src/shared/api";

describe("fetchRoutes", function() {
  it("should retrieve routes", async function() {
    fetchMock.mock("*", {
      resultSet: {
        route: [{
          route: 100,
          type: "R",
          desc: "Route 1",
        }, {
          route: 101,
          type: "B",
          desc: "Route 2",
        }, {
          route: 500,
          type: "B",
          desc: "Route 6",
        }, {
          route: 106,
          type: "R",
          desc: "Route 8",
        }],
      },
    });

    let routes = await fetchRoutes();

    expect(routes).to.deep.equal([{
      id: 100,
      name: "Route 1",
    }, {
      id: 101,
      name: "Route 2",
    }, {
      id: 500,
      name: "Route 6",
    }, {
      id: 106,
      name: "Route 8",
    }]);

    fetchMock.restore();
  });
});
