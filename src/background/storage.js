export async function getStops() {
  let results = await browser.storage.sync.get({ stops: [] });
  if (!("stops" in results)) {
    return [];
  } else {
    return results.stops;
  }
}

export function setStops(stops) {
  return browser.storage.sync.set({ stops });
}
