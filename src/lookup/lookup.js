import React from "react";
import ReactDOM from "react-dom";

import { APP_ID } from "../shared/appid.js";
import { URL_ROUTES } from "../shared/urls.js";

const port = browser.runtime.connect(null, { name: "lookup" });

function isNumber(s) {
  return !isNaN(parseInt(s));
}

class Lookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: [],
      selectedRoute: "",
      directions: [],
      selectedDirection: "",
      stops: [],
      selectedStop: "",
    };

    this.changeRoute = this.changeRoute.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.changeStop = this.changeStop.bind(this);
    this.addStop = this.addStop.bind(this);

    this.retrieveRoutes();
  }

  async retrieveRoutes() {
    let url = new URL(URL_ROUTES);
    url.searchParams.set("appID", APP_ID);
    url.searchParams.set("json", "true");

    let response = await fetch(url.href);
    if (response.ok) {
      let json = await response.json();
      let routes = json.resultSet.route.map(r => ({
        id: r.route,
        name: r.desc,
      }));
      routes.sort((a, b) => {
        if (isNumber(a.name)) {
          if (isNumber(b.name)) {
            return parseInt(a) - parseInt(b);
          }
          return 1;
        } else if (isNumber(b.name)) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      });

      this.setState({
        routes,
        selectedRoute: routes[0].id,
      });

      this.retrieveStops(routes[0].id);
    } else {
      console.error(response.statusText);
    }
  }

  async retrieveStops(route) {
    let url = new URL(URL_ROUTES);
    url.searchParams.set("appID", APP_ID);
    url.searchParams.set("json", "true");
    url.searchParams.set("route", route);
    url.searchParams.set("dir", "true");
    url.searchParams.set("stops", "true");

    let response = await fetch(url.href);
    if (response.ok) {
      let json = await response.json();
      let route = json.resultSet.route[0];
      let directions = [];

      for (let dir of route.dir) {
        directions.push({
          id: dir.dir,
          name: dir.desc,
          stops: dir.stop.map(stop => ({
            id: stop.locid,
            long: stop.lng,
            lat: stop.lat,
            name: stop.desc,
          })),
        });
      }

      directions.sort((a, b) => a.name.localeCompare(b.name));

      this.setState({
        directions,
        selectedDirection: 0,
        stops: directions[0].stops,
        selectedStop: 0,
      });
    } else {
      console.error(response.statusText);
    }
  }

  changeRoute(event) {
    this.setState({
      selectedRoute: event.target.value,
      directions: [],
      selectedDirection: "",
      stops: [],
      selectedStop: "",
    });

    this.retrieveStops(event.target.value);
  }

  changeDirection(event) {
    this.setState({
      selectedDirection: event.target.value,
      stops: this.state.directions[event.target.value].stops,
      selectedStop: 0,
    });
  }

  changeStop(event) {
    this.setState({ selectedStop: event.target.value });
  }

  addStop() {
    let direction = this.state.directions[this.state.selectedDirection];
    let stop = this.state.stops[this.state.selectedStop];

    port.postMessage({
      message: "addStop",
      data: {
        route: parseInt(this.state.selectedRoute),
        direction: direction.id,
        stop: stop.id,
      }
    });
  }

  render() {
    return (
      <div>
        <div className="section">
          <p>Line</p>
          <p>
            <select value={this.state.selectedRoute} onChange={this.changeRoute}>
              {this.state.routes.map((route) =>
                <option key={route.id} value={route.id}>{route.name}</option>
              )}
            </select>
          </p>
        </div>
        <div className="section">
          <p>Direction</p>
          <p>
            <select value={this.state.selectedDirection} onChange={this.changeDirection}>
              {this.state.directions.map((direction, i) =>
                <option key={i} value={i}>{direction.name}</option>
              )}
            </select>
          </p>
        </div>
        <div className="section">
          <p>Stop</p>
          <p>
            <select value={this.state.selectedStop} onChange={this.changeStop}>
              {this.state.stops.map((stop, i) =>
                <option key={i} value={i}>{stop.name}</option>
              )}
            </select>
          </p>
        </div>
        <p id="addRow"><button type="button" onClick={this.addStop}>Add</button></p>
      </div>
    );
  }
}

ReactDOM.render(<Lookup/>, document.getElementById("app"));
