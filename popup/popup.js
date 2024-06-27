document.getElementById("track-price").addEventListener("click", () => {
  const productUrl = document.getElementById("productUrl").value;
  if (productUrl) {
    chrome.storage.local.set({ productURL: productUrl }, () => {
      document.getElementById("status").innerText = "Tracking started!";
    });
  } else {
    document.getElementById("status").innerText = "Please enter a valid URL.";
  }
});

// document.getElementById("track-price").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     console.log("Sending message to content script...", tabs);

//     chrome.tabs.sendMessage(
//       tabs[0].id,
//       { action: "fetchPrice" },
//       (response) => {
//         console.log("response: " + response.price);
//         console.log(chrome.runtime.lastError);

//         if (chrome.runtime.lastError) {
//           // console.error("Error:", chrome.runtime?.lastError?.message);
//           document.getElementById("status").innerText =
//             "Failed to connect to content script.";
//         } else if (response && response?.price) {
//           chrome.storage.local.set(
//             { trackedPrice: response.price, productURL: tabs[0].url },
//             () => {
//               document.getElementById("status").innerText =
//                 "Price tracking started!";
//             }
//           );
//         } else {
//           document.getElementById("status").innerText =
//             "Failed to get the price.";
//         }
//       }
//     );
//   });
// });
