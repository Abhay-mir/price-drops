const flag = false;
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkPrice", { periodInMinutes: 0.1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "checkPrice") {
    chrome.storage.local.get("productURL", async (result) => {
      const productURL = result.productURL;
      if (productURL) {
        try {
          await createOffscreenDocument();
          chrome.runtime.sendMessage({
            action: "fetchPrice",
            url: productURL,
          });
        } catch (error) {
          console.error("Error creating offscreen document:", error);
        }
      }
    });
  }
});

async function createOffscreenDocument() {
  const isOffscreenDocumentCreated = await chrome.offscreen.hasDocument();

  if (!isOffscreenDocumentCreated) {
    return chrome.offscreen.createDocument({
      url: chrome.runtime.getURL("offscreen.html"),
      reasons: ["DOM_PARSER"],
      justification: "Fetch and parse product price",
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "priceFetched") {
    console.log("Extracted price:", request.price);
    console.log("Extracted productURL:", request.productURL);
    showPriceNotification(request.price, request.productURL);

    // Handle the fetched price as needed
  }
});
// Object to map product URLs to notification IDs
const urlToNotificationIdMap = {};

// Define the listener once, outside of the showPriceNotification function
chrome.notifications.onClicked.addListener(function notificationClickHandler(
  notificationId
) {
  // Find the product URL by its notification ID
  const productUrl = Object.keys(urlToNotificationIdMap).find(
    (url) => urlToNotificationIdMap[url] === notificationId
  );
  if (productUrl) {
    chrome.tabs.create({ url: productUrl }, () => {
      chrome.notifications.clear(notificationId); // Clear the notification after opening tab
      delete urlToNotificationIdMap[productUrl]; // Remove the entry from the map
    });
  }
});

function showPriceNotification(price, productUrl) {
  // Use productUrl as the key to find or create a notification ID
  let notificationId = urlToNotificationIdMap[productUrl];
  if (!notificationId) {
    // If this URL hasn't been used for a notification yet, create a new ID
    notificationId = `priceUpdate-${
      Object.keys(urlToNotificationIdMap).length
    }`;
    urlToNotificationIdMap[productUrl] = notificationId;
  }

  const notificationOptions = {
    type: "basic",
    iconUrl: "images/icon128.png",
    title: "Price Update",
    message: `The price has been updated to ${price}`,
    buttons: [
      {
        title: "View Product",
      },
    ],
  };

  // Create or update the notification
  chrome.notifications.create(
    notificationId,
    notificationOptions,
    (createdNotificationId) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error creating notification:",
          chrome.runtime.lastError.message
        );
        return;
      }
    }
  );
}
