import { APP_ID } from "../shared/appid.js";
import { URL_ARRIVALS } from "../shared/urls.js";

const UPDATE_TIMER = 60000;

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
  url.searchParams.set("locIDs", stops.join(","));
  url.searchParams.set("appID", APP_ID);
  url.searchParams.set("json", "true");

  let response = await fetch(url.href);
  if (response.ok) {
    let json = await response.json();

    let stops = {};
    let stopData = [];
    for (let location of json.resultSet.location) {
      let stop = {
        id: location.locid,
        long: location.lng,
        lat: location.lat,
        name: location.desc,
        arrivals: [],
      };

      stops[location.locid] = stop;
      stopData.push(stop);
    }

    for (let arrival of json.resultSet.arrival) {
      stops[arrival.locid].arrivals.push({
        scheduled: new Date(arrival.scheduled),
        estimated: new Date(arrival.estimated),
      });
    }

    return stopData;
  } else {
    console.error(response.statusText);
    return [];
  }
}

async function update() {
  timer = null;

  let stops = await retrieveStops();

  console.log(`Sending to ${ports.length} listeners`)
  for (let port of ports) {
    port.postMessage({
      message: "arrivals",
      data: stops,
    });
  }

  timer = setTimeout(update, UPDATE_TIMER);
}

function newListener(port) {
  console.log("connect");
  ports.push(port);
  port.onDisconnect.addListener(() => {
    console.log("disconnect");
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
        stops = stops.filter(s => s != message.data);
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
