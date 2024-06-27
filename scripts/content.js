console.log("Content script is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  chrome.storage.local.get("productURL", async (result) => {
    const productURL = result.productURL;
    console.log("productURL:", productURL);
    if (request.action === "getPrice") {
      // Example: assuming the price is in an element with ID 'priceblock_ourprice'
      const priceElement = document.querySelector(".a-price-whole");
      console.log("prince element", priceElement);
      if (priceElement) {
        const price = priceElement.innerText;
        console.log("price", price);

        sendResponse({ price: price });
        chrome.runtime.sendMessage({
          action: "priceFetched",
          price,
          productURL: ,
        });
      } else {
        sendResponse({ price: null });
      }
    }
  });
});
