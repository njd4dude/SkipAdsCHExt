// task 7/10 remove ad skipper functioanlity it doesnt work anymore.. might move on to new app it seems they keep detecitng speed if its over 4x
document.addEventListener("DOMContentLoaded", function () {
  const videoSrcObserver = new MutationObserver(videoSrcObserverHandler);
  const adObserver = new MutationObserver(adObserverHandler);
  let speed_up_enabled = false;
  let mute_ads_enabled = false;
  let videoPlayBackRate = 1;

  //task 7/3 the ones that chrome.storage.local.get from storage like these should be in the bg scirpt

  function getSpeedfromStorage() {
    chrome.storage.local.get("speed", function (result) {
      if (result.speed === undefined) {
        chrome.storage.local.set({ speed: 4 });
        videoPlayBackRate = 4;
      } else {
        videoPlayBackRate = result.speed;
      }
    });
  }
  //#region DOM MANIPULATION FUNCTIONS

  function speedUpAd() {
    const video = document.querySelector("video");
    if (video) {
      video.playbackRate = videoPlayBackRate;
      videoSrcObserver.observe(video, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["src"],
      });
    }
  }

  function muteAd() {
    const video = document.querySelector("video");
    if (video) {
      video.muted = true;
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
    if (speed_up_enabled) {
      mutationsList[0].target.playbackRate = videoPlayBackRate;
    }
    if (mute_ads_enabled) {
      mutationsList[0].target.muted = true;
    }
  }

  // Function to handle changes in the style property of the target element. Bascially detects when an ad is playing.
  function adObserverHandler(mutationsList) {
    if (mutationsList[0].target.style.display === "") {
      if (speed_up_enabled) speedUpAd();
      if (mute_ads_enabled) muteAd();
    } else {
      resetSpeedUp();
      resetMuteAds();
    }
  }
  //#endregion MUTATION CALLBACK FUNCTIONS

  function resetSpeedUp() {
    const video = document.querySelector("video");
    video.playbackRate = 1;
    videoSrcObserver.disconnect();
  }

  function resetMuteAds() {
    const video = document.querySelector("video");
    video.muted = false;
    videoSrcObserver.disconnect();
  }

  // Function to start observing the target node
  function startAdObserving() {
    const adProgressBar = document.querySelector(
      ".ytp-ad-persistent-progress-bar-container"
    );
    if (adProgressBar) {
      //ad playing...
      if (adProgressBar.style.display === "") {
        if (speed_up_enabled) speedUpAd();
        if (mute_ads_enabled) muteAd();
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
    return new Promise((resolve, reject) => {
      chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (changes.speed_up || changes.mute_ads || changes.speed) {
          if (changes.speed?.newValue !== undefined) {
            videoPlayBackRate = changes.speed.newValue;
          }

          if (changes.speed_up?.newValue === true) {
            speed_up_enabled = true;
          } else if (changes.speed_up?.newValue === false) {
            speed_up_enabled = false;
            resetSpeedUp();
          }

          if (changes.mute_ads?.newValue === true) {
            mute_ads_enabled = true;
          } else if (changes.mute_ads?.newValue === false) {
            mute_ads_enabled = false;
            resetMuteAds();
          }

          if (speed_up_enabled === false && mute_ads_enabled === false) {
            adObserver.disconnect();
          } else {
            startAdObserving();
          }
        }
      });
      resolve();
    });
  }

  //task 7/3 I jus thought about how i coudl actually set the default to true in bacgkround script instead
  function firstLoad() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        ["speed_up", "mute_ads"],
        async function (result) {
          if (result.speed_up === undefined) {
            await chrome.storage.local.set({ speed_up: true });
          } else if (result.speed_up === true) {
            speed_up_enabled = true;
          }

          if (result.mute_ads === undefined) {
            await chrome.storage.local.set({ mute_ads: true });
          } else if (result.mute_ads === true) {
            mute_ads_enabled = true;
          }

          if (speed_up_enabled || mute_ads_enabled) {
            startAdObserving();
          }

          resolve();
        }
      );
    });
  }

  // startup calls
  async function startup() {
    getSpeedfromStorage();
    await setup_listeners();
    await firstLoad();
  }
  startup();
});
