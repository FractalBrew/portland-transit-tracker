import { APP_ID } from "../shared/appid.js";
import { URL_ARRIVALS } from "../shared/urls.js";

const UPDATE_TIMER = 30000;

let timer = null;
let ports = [];

async function getStops() {
  let results = await browser.storage.sync.get({ stops: [] });
  if (!("stops" in results)) {
    return [];
  } else {
    return results.stops;
  }
}

function setStops(stops) {
  return browser.storage.sync.set({ stops });
}

async function retrieveStops() {
  let stops = await getStops();
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

async function update() {
  timer = null;

  let stops = await retrieveStops();

  for (let port of ports) {
    port.postMessage({
      message: "arrivals",
      data: stops,
    });
  }

  timer = setTimeout(update, UPDATE_TIMER);
}

function newListener(port) {
  ports.push(port);
  port.onDisconnect.addListener(() => {
    ports = ports.filter(p => p != port);
    if (ports.length == 0) {
      clearTimeout(timer);
      timer = null;
    }
  });

  port.onMessage.addListener(async function(message) {
    switch (message.message) {
      case "addStop": {
        let stops = await getStops();
        stops.push(message.data);
        await setStops(stops);

        if (timer) {
          clearTimeout(timer);
          update();
        }
        break;
      }
      case "removeStop": {
        let stops = await getStops();
        stops = stops.filter(s => {
          if (s.route == message.data.route &&
              s.direction == message.data.direction &&
              s.stop == message.data.stop) {
            return false;
          }
          return true;
        });
        await setStops(stops);

        if (timer) {
          clearTimeout(timer);
          update();
        }
        break;
      }
      default: {
        console.error("Unexpected message", message.message);
      }
    }
  });

  if (timer) {
    clearTimeout(timer);
  }

  update();
}

browser.runtime.onConnect.addListener(newListener);
