let intervalId;
function clickSkipButton() {
  intervalId = setInterval(function () {
    const skip_button = document.querySelector(".ytp-skip-ad-button");
    if (skip_button) {
      console.log("Skip button found, clicking it");
      skip_button.click();
    }
  }, 1000);
}

// Function to handle changes in the style property of the target element
function handleStyleChanges(mutationsList) {
  if (mutationsList[0].target.style.display === "") {
    clickSkipButton();
  } else {
    clearInterval(intervalId);
  }
}

// Create a new MutationObserver instance with the callback function
const observer = new MutationObserver(handleStyleChanges);

// Function to start observing the target node
function startObserving() {
  console.log("startObserving");
  const adProgressBar = document.querySelector(
    ".ytp-ad-persistent-progress-bar-container"
  );
  if (adProgressBar) {
    if (adProgressBar.style.display === "") {
      clickSkipButton();
    }
    observer.observe(adProgressBar, {
      attributes: true,
      attributeOldValue: true, // Record old values
      attributeFilter: ["style"], // Only watch for changes in the 'style' attribute
    });
  } else {
    setTimeout(startObserving, 500);
  }
}

// listen for changes in the "skip_ads" value in the chrome storage
function skip_ads_listener() {
  chrome.storage.onChanged.addListener(function (changes, areaName) {
    console.log("changes: ", changes);
    if (changes.skip_ads?.newValue === true) {
      console.log("skip_Ads new value is true");
      startObserving();
    } else {
      console.log("skip_Ads new value is false");
      clearInterval(intervalId);
    }
  });
}
// startup calls
console.log("content.js running");
skip_ads_listener();
// get the current state of the skip_ads value on startup and use that to determine if the observer should be started
// "skip_ads" controls whether or not the content script runs
chrome.storage.local.get("skip_ads", function (result) {
  console.log("result: ", result.skip_ads);
  if (result.skip_ads) {
    startObserving();
  }
});
