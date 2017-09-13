const URL_ARRIVALS = "https://developer.trimet.org/ws/V1/arrivals";

const UPDATE_TIMER = 60000;
const STOPS = [9299, 7500];

let timer = setTimeout(update, UPDATE_TIMER);

async function update() {
  console.log("update");
  clearTimeout(timer);

  let url = new URL(URL_ARRIVALS);
  url.searchParams.set("locIDs", STOPS.join(","));
  url.searchParams.set("appID", APP_ID);
  url.searchParams.set("json", "true");

  console.log("Requesting", url.href);
  let response = await fetch(url.href);
  if (response.ok) {
    let json = await response.json();
  } else {
    console.error(response.statusText);
  }

  timer = setTimeout(update, UPDATE_TIMER);
}

update();
