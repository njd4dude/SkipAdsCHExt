document.addEventListener("DOMContentLoaded", function () {
  let intervalId;
  function clickSkipButton() {
    intervalId = setInterval(function () {
      console.log("clicking skip button...");
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
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
    console.log("startObserving...");
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
      console.log("progress bar not found retrying in 500ms");
      setTimeout(startObserving, 500);
    }
  }

  // listen for changes in the "skip_ads" value in the chrome storage
  function skip_ads_listener() {
    console.log("setting up listener for skip_ads");
    return new Promise((resolve, reject) => {
      chrome.storage.onChanged.addListener(function (changes, areaName) {
        console.log("change detected: ", changes);
        if (changes.skip_ads?.newValue === true) {
          console.log("going to start observer");
          startObserving();
        } else if (changes.skip_ads?.newValue === false) {
          observer.disconnect();
          console.log("disconnecting observer");
        }
      });
      console.log("resolving skip_ads_listener");
      resolve();
    });
  }

  // get the current state of the skip_ads value on startup and use that to determine if the observer should be started
  // "skip_ads" controls whether or not the content script runs
  function firstLoad() {
    console.log("firstLoad...");
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("skip_ads", function (result) {
        console.log("data found for result", result.skip_ads);
        if (result.skip_ads === undefined) {
          // set to true by default
          chrome.storage.local.set({ skip_ads: true }); // this will automatically trigger the skip_ads_listener because a change is made, starting the observer
          console.log("setting skip_ads to true ");
        } else if (result.skip_ads === true) {
          console.log("result.skip_ads is true so starting observer");
          startObserving();
        } else if (result.skip_ads === false) {
          console.log(
            "not going to skip ads and start observing because skip_ads is false"
          );
        }
        console.log("end of firstLoad");
        resolve();
      });
    });
  }

  // startup calls
  async function startup() {
    console.log("starting up...");
    await skip_ads_listener();
    await firstLoad();
  }

  startup();
});
