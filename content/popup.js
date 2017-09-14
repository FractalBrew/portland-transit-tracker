const STOPS = [9299, 7500];

function init() {
  let list = document.getElementById("stopList");

  for (let stop of STOPS) {
    let row = document.createElement("tr");
    row.innerHTML = "<td colspan=\"4\" class=\"loading\"></td>";
    list.appendChild(row);
  }
}

window.addEventListener("load", init, { once: true });

let port = browser.runtime.connect(null, { name: "panel" });

window.addEventListener("unload", () => {
  port.disconnect();
}, { once: true });

port.onMessage.addListener((message) => {
  if (message.message == "arrivals") {
    let list = document.getElementById("stopList");
    while (list.firstChild) {
      list.firstChild.remove();
    }

    let stopData = message.data;
    for (let stop of stopData) {
      let row = document.createElement("tr");
      let name = document.createElement("td");
      name.innerText = stop.name;
      name.className = "stopName";
      row.appendChild(name);
      for (let i = 0; i < 3; i++) {
        let arrival = document.createElement("td");
        if (i < stop.arrivals.length) {
          let time = stop.arrivals[i].expected ? stop.arrivals[i].expected : stop.arrivals[i].scheduled;
          let diff = time.getTime() - Date.now();
          diff /= 60000;
          arrival.innerText = `${parseInt(diff)}mins`;
          arrival.className = stop.arrivals[i].expected ? "arrival expected" : "arrival scheduled";
        }
        row.appendChild(arrival);
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerText = "X";
      button.className = "delete";

      let cell = document.createElement("td");
      cell.appendChild(button);

      row.appendChild(cell);

      list.appendChild(row);
    }
  }
});
