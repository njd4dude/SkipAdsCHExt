// task 6/28: Create an option in the popup to turn off the speed up ad feature
document.addEventListener("DOMContentLoaded", function () {
  let intervalId;
  const videoObserver = new MutationObserver(handleVideoChanges);
  const observer = new MutationObserver(handleStyleChanges);
  const videoPlayBackRate = 4;

  //#region DOM MANIPULATION FUNCTIONS
  function clickSkipButton() {
    intervalId = setInterval(function () {
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
        skip_button.click();
        console.log("skip button clicked");
      }
    }, 1000);
  }

  function speedUpAd() {
    const video = document.querySelector("video");
    if (video) {
      console.log("video element exists: ", video);
      video.playbackRate = videoPlayBackRate;
      videoObserver.observe(video, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["src"],
      });
    }
  }
  //#endregion DOM MANIPULATION FUNCTIONS

  //#region  MUTATION CALLBACK FUNCTIONS
  function handleVideoChanges(mutationsList) {
    console.log("video src changed: ", mutationsList);
    mutationsList[0].target.playbackRate = videoPlayBackRate;
    console.log("playback rate changed to 2x....");
  }

  // Function to handle changes in the style property of the target element
  function handleStyleChanges(mutationsList) {
    if (mutationsList[0].target.style.display === "") {
      console.log("there is an ad playing, click skip button and speed up ad");
      clickSkipButton();
      speedUpAd();
    } else {
      console.log("no more ad playing");

      clearInterval(intervalId);

      const video = document.querySelector("video");
      video.playbackRate = 1;
      videoObserver.disconnect();
      console.log("disconnected video observer!");
    }
  }
  //#endregion MUTATION CALLBACK FUNCTIONS

  // Function to start observing the target node
  function startObserving() {
    const adProgressBar = document.querySelector(
      ".ytp-ad-persistent-progress-bar-container"
    );
    if (adProgressBar) {
      if (adProgressBar.style.display === "") {
        console.log(
          "there is an ad playing, click skip button and speed up ad...."
        );
        clickSkipButton();
        speedUpAd();
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
          console.log("ad detection observer disconnected");
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
        console.log("skip_ads value: ", result.skip_ads);
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
