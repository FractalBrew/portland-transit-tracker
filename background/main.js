const URL_ARRIVALS = "https://developer.trimet.org/ws/V1/arrivals";

const UPDATE_TIMER = 60000;
const STOPS = [9299, 7500];

let timer = null;
let ports = [];

async function update() {
  timer = null;
  let url = new URL(URL_ARRIVALS);
  url.searchParams.set("locIDs", STOPS.join(","));
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

    for (let port of ports) {
      port.postMessage({
        message: "arrivals",
        data: stopData,
      });
    }
  } else {
    console.error(response.statusText);
  }

  if (ports.length) {
    timer = setTimeout(update, UPDATE_TIMER);
  }
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

  if (!timer) {
    update();
  }
}

browser.runtime.onConnect.addListener(newListener);
