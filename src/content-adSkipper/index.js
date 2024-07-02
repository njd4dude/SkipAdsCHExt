document.addEventListener("DOMContentLoaded", function () {
  let intervalId;
  const videoSrcObserver = new MutationObserver(videoSrcObserverHandler);
  const adObserver = new MutationObserver(adObserverHandler);
  let skip_ads_enabled = false;
  let speed_up_enabled = false;
  let videoPlayBackRate = 2;

  //#region DOM MANIPULATION FUNCTIONS

  function clickSkipButton() {
    let i = 0;
    intervalId = setInterval(function () {
      console.log("looking for skip button", i++);
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
        skip_button.click();
        console.log("skip button clicked");
        clearInterval(intervalId);
      }
    }, 1000);
  }

  function speedUpAd() {
    console.log("videoPlayBackRate inside of speedUpAd(): ", videoPlayBackRate);
    const video = document.querySelector("video");
    if (video) {
      console.log("video element exists: ", video);
      video.playbackRate = videoPlayBackRate;
      videoSrcObserver.observe(video, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["src"],
      });
    }
  }
  //#endregion DOM MANIPULATION FUNCTIONS

  //#region  MUTATION CALLBACK FUNCTIONS
  function videoSrcObserverHandler(mutationsList) {
    mutationsList[0].target.playbackRate = videoPlayBackRate;
  }

  // Function to handle changes in the style property of the target element. Bascially detects when an ad is playing.
  function adObserverHandler(mutationsList) {
    console.log(
      "----MUTATION HANDLER----\nadObserverHandler called with values skip_ads_enabled: ",
      skip_ads_enabled,
      " and speed_up_enabled: ",
      speed_up_enabled
    );
    if (mutationsList[0].target.style.display === "") {
      console.log("there is an ad playing, click skip button and speed up ad");

      if (skip_ads_enabled) clickSkipButton();
      if (speed_up_enabled) speedUpAd();
    } else {
      console.log("no more ad playing");
      clearInterval(intervalId);
      const video = document.querySelector("video");
      video.playbackRate = 1;
      videoSrcObserver.disconnect();
    }
  }
  //#endregion MUTATION CALLBACK FUNCTIONS

  function resetSkipAds() {
    console.log("resetSkipAds called");
    clearInterval(intervalId);
  }
  function resetSpeedUp() {
    console.log("resetSpeedUp called");
    const video = document.querySelector("video");
    video.playbackRate = 1;
    videoSrcObserver.disconnect();
  }

  // Function to start observing the target node
  function startAdObserving() {
    console.log(
      "startAdObserving called with values skip_ads_enabled: ",
      skip_ads_enabled,
      " and speed_up_enabled: ",
      speed_up_enabled
    );
    const adProgressBar = document.querySelector(
      ".ytp-ad-persistent-progress-bar-container"
    );
    if (adProgressBar) {
      console.log("progress bar found ");

      //ad playing...
      if (adProgressBar.style.display === "") {
        console.log("there is an ad playing..");

        if (skip_ads_enabled) clickSkipButton();
        if (speed_up_enabled) speedUpAd();
      }

      adObserver.observe(adProgressBar, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"],
      });
    } else {
      setTimeout(startAdObserving, 500);
    }
  }

  function setup_listeners() {
    console.log("skip ads listener called");
    return new Promise((resolve, reject) => {
      chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (changes.skip_ads || changes.speed_up) {
          console.log("changes: ", changes);
          if (changes.skip_ads?.newValue === true) {
            skip_ads_enabled = true;
          } else if (changes.skip_ads?.newValue === false) {
            skip_ads_enabled = false;
            resetSkipAds();
          }

          if (changes.speed_up?.newValue === true) {
            speed_up_enabled = true;
          } else if (changes.speed_up?.newValue === false) {
            speed_up_enabled = false;
            resetSpeedUp();
          }

          if (skip_ads_enabled === false && speed_up_enabled === false) {
            console.log("disconnecting adObserver");
            adObserver.disconnect();
          } else {
            console.log("starting adObserver in setup_listeners");
            startAdObserving();
          }
        }
      });
      resolve();
    });
  }

  function firstLoad() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        ["skip_ads", "speed_up"],
        async function (result) {
          console.log("result.skip_ads value: ", result.skip_ads);
          console.log("result.speed_up value: ", result.speed_up);

          if (result.skip_ads === undefined) {
            await chrome.storage.local.set({ skip_ads: true });
          } else if (result.skip_ads === true) {
            skip_ads_enabled = true;
          }

          if (result.speed_up === undefined) {
            await chrome.storage.local.set({ speed_up: true });
          } else if (result.speed_up === true) {
            speed_up_enabled = true;
          }

          if (skip_ads_enabled || speed_up_enabled) {
            console.log("starting adObserver in firstLoad");
            startAdObserving();
          }

          resolve();
        }
      );
    });
  }

  // startup calls
  async function startup() {
    await setup_listeners();
    await firstLoad();
    console.log("Content script loaded");
  }
  startup();
});
