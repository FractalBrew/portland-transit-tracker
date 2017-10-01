import { APP_ID } from "./appid";
import { URL_ARRIVALS, URL_ROUTES } from "./urls";
import { URL } from "url";

export async function fetchArrivals(stops) {
  if (stops.length == 0) {
    return [];
  }

  let url = new URL(URL_ARRIVALS);
  url.searchParams.set("locIDs", Array.from(new Set(stops.map(s => s.stop))).join(","));
  url.searchParams.set("appID", APP_ID);
  url.searchParams.set("json", "true");
  url.searchParams.set("minutes", 60);
  url.searchParams.set("arrivals", 3);

  let response = await fetch(url.href);
  if (response.ok) {
    let json = await response.json();

    for (let stop of stops) {
      for (let location of json.resultSet.location) {
        if (stop.stop == location.id) {
          stop.long = location.lng;
          stop.lat = location.lat;
          stop.stopName = location.desc;
          stop.arrivals = [];
          break;
        }
      }
    }

    for (let arrival of json.resultSet.arrival) {
      for (let stop of stops) {
        if (stop.stop == arrival.locid &&
            stop.direction == arrival.dir &&
            stop.route == arrival.route) {
          stop.routeName = arrival.shortSign;
          stop.arrivals.push({
            scheduled: new Date(arrival.scheduled),
            estimated: new Date(arrival.estimated),
          });
          break;
        }
      }
    }

    return stops;
  } else {
    console.error(response.statusText);
    return [];
  }
}

export async function fetchRoutes() {
  let url = new URL(URL_ROUTES);
  url.searchParams.set("appID", APP_ID);
  url.searchParams.set("json", "true");

  let response = await fetch(url.href);
  if (response.ok) {
    let json = await response.json();
    return json.resultSet.route.map(r => ({
      id: r.route,
      name: r.desc,
    }));
  } else {
    console.error(response.statusText);
    return [];
  }
}

export async function fetchStops(route) {
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

    return directions;
  } else {
    console.error(response.statusText);
    return [];
  }
}
