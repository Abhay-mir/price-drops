// Input fields
const trackPrice = document.getElementById("track-price");
const trackProductName = document.getElementById("track-product-name");
const trackProductNameError = document.getElementById(
  "track-product-name-error"
);
const trackProductUrl = document.getElementById("track-product-url");
const trackProductUrlError = document.getElementById("track-product-url-error");

// Panels
const dashboardPanel = document.getElementById("dashboard-panel");
const addPanel = document.getElementById("add-panel");
const historyPanel = document.getElementById("history-panel");
const dashboardTag = document.getElementById("dashboard-tag");
const addTag = document.getElementById("add-tag");
const historyTag = document.getElementById("history-tag");

const togglePanel = (panel, tag) => {
  addPanel?.classList.add("is-hidden");
  dashboardPanel?.classList.add("is-hidden");
  historyPanel?.classList.add("is-hidden");
  panel?.classList.remove("is-hidden");
  addTag?.classList.remove("is-active");
  dashboardTag?.classList.remove("is-active");
  historyTag?.classList.remove("is-active");
  tag?.classList.add("is-active");
};

addTag.addEventListener("click", () => {
  togglePanel(addPanel, addTag);
});

dashboardTag.addEventListener("click", () => {
  togglePanel(dashboardPanel, dashboardTag);
});

historyTag.addEventListener("click", () => {
  togglePanel(historyPanel, historyTag);
});

trackProductName.addEventListener("change", (event) => {
  const newValue = event?.target?.value;
  if (!!newValue) {
    trackProductNameError.classList.add("is-hidden");
  }
});

function isValidAmazonUrl(url) {
  try {
    let parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }
    if (parsedUrl.hostname.endsWith("amazon.in")) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

trackPrice.addEventListener("click", () => {
  if (!trackProductName.value) {
    console.log("herree nik");
    trackProductNameError.innerText = "Please enter a product name.";
    trackProductNameError.classList.remove("is-hidden");
    return;
  }
  if (!trackProductUrl?.value) {
    trackProductUrlError.innerText = "Please enter an amazon product url.";
    trackProductUrlError.classList.remove("is-hidden");
    return;
  }

  const productUrl = trackProductUrl?.value;
  const isValid = isValidAmazonUrl(productUrl);
  console.log("isValidfor the changes", isValid);
  if (!isValid) {
    trackProductUrlError.innerText =
      "Please enter a valid Amazon URL. Eg:- https://www.amazon.in/*";
    trackProductUrlError.classList.remove("is-hidden");
    return;
  }
  if (productUrl) {
    chrome.storage.local.set({ productURL: productUrl }, () => {
      document.getElementById("status").innerText = "Tracking started!";
    });
  } else {
    document.getElementById("status").innerText = "Please enter a valid URL.";
  }
});
