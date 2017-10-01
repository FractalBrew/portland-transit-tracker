import { getStops, setStops } from "./storage";
import { fetchArrivals } from "../shared/api";

const UPDATE_TIMER = 30000;

let timer = null;
let ports = [];

async function update() {
  timer = null;

  let stops = await getStops();
  let data = await fetchArrivals(stops);

  for (let port of ports) {
    port.postMessage({
      message: "arrivals",
      data,
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
