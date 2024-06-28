// task: 6/7 just commited latest commit with the domcontent loaded event listener. Next step is to remove unessecary console logs and sumbit it for review for the store.
// task: 6/27 I want to test out chaning the playback speed of the ad
document.addEventListener("DOMContentLoaded", function () {
  let intervalId;
  function clickSkipButton() {
    intervalId = setInterval(function () {
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
    return new Promise((resolve, reject) => {
      chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (changes.skip_ads?.newValue === true) {
          startObserving();
        } else if (changes.skip_ads?.newValue === false) {
          observer.disconnect();
        }
      });

      resolve();
    });
  }

  // get the current state of the skip_ads value on startup and use that to determine if the observer should be started
  // "skip_ads" controls whether or not the content script runs
  function firstLoad() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("skip_ads", function (result) {
        if (result.skip_ads === undefined) {
          // set to true by default
          chrome.storage.local.set({ skip_ads: true }); // this will automatically trigger the skip_ads_listener because a change is made, starting the observer
        } else if (result.skip_ads === true) {
          startObserving();
        }

        resolve();
      });
    });
  }

  // startup calls
  async function startup() {
    await skip_ads_listener();
    await firstLoad();
    console.log("Content script loaded");
  }

  startup();
});
