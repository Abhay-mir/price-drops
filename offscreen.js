console.log("Content script is running");

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "fetchPrice") {
    try {
      console.log("request.url ", request.url);
      const response = await fetch(request.url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const priceElement = doc.querySelector(".a-price-whole");
      const price = priceElement ? priceElement.innerText : null;
      chrome.runtime.sendMessage({
        action: "priceFetched",
        price: price,
        productURL: request.url,
      });
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  }
});
