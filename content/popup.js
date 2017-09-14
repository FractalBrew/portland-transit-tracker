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
      row.dataset.locid = stop.id;

      let name = document.createElement("td");
      name.innerText = stop.name;
      name.className = "stopName";
      row.appendChild(name);
      for (let i = 0; i < 3; i++) {
        let arrival = document.createElement("td");
        if (i < stop.arrivals.length) {
          let time = stop.arrivals[i].estimated ? stop.arrivals[i].estimated : stop.arrivals[i].scheduled;
          let diff = time.getTime() - Date.now();
          diff /= 60000;

          let span = document.createElement("span");
          span.className = stop.arrivals[i].estimated ? "estimated" : "scheduled";
          span.innerText = `${parseInt(diff)}mins`;

          arrival.className = "arrival";
          arrival.appendChild(span);
        }
        row.appendChild(arrival);
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerText = "X";
      button.className = "delete";

      let cell = document.createElement("td");
      cell.className = "deleteCell";
      cell.appendChild(button);

      row.appendChild(cell);

      list.appendChild(row);
    }
  }
});

document.getElementById("addButton").addEventListener("click", () => {
  let stop = document.getElementById("stop").value;
  if (stop && parseInt(stop).toString() == stop) {
    port.postMessage({
      message: "addStop",
      data: parseInt(stop),
    });

    document.getElementById("stop").value = "";
  }
});

document.getElementById("stopList").addEventListener("click", (event) => {
  if (event.target.className == "delete") {
    let stop = event.target.parentNode.parentNode.dataset.locid;
    port.postMessage({
      message: "removeStop",
      data: parseInt(stop),
    });
  }
});
