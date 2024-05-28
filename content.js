// working code but I take off some of the extra code that we don't really need in production 5/25/24
// 5/27 noticed some inconsistencies with it detecting an addedNodes in the mutation.addedNodes when the observer is started.
// document.querySelector(".ytp-skip-ad-button").click();
// something else i could try using to observe "ytp-ad-persistent-progress-bar-container". I saw that when ad an plays the display proeprty changes from display none, to nothing
// 5/28 working code now. Testing and then shipping to production and adding the monetization part using Mellowtel. Remove uncessary console logs.
console.log("content script started.");

{
  let intervalId;
  // Function to click skip button
  function clickSkipButton() {
    intervalId = setInterval(function () {
      console.log("Entered interval to click skip button.");
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
        console.log("Skip button found! Clicking it...");
        skip_button.click();
      }
    }, 1000);
  }

  // check if ytp-ad-player-overlay-layout exists instead of checkiing for addedNodesLength and remvoedNodesLength instead of checking for mutations basically
  // if ytp-ad-player-overlay-layout exists, then clickSkipButton() function else clearInterval()
  // Function to handle mutations
  function handleMutations(mutations) {
    console.log("mutation detected. Mutations: ", mutations);

    if (mutations[0].attributeName === "style") {
      console.log("style attribute changed");
      if (mutations[0].target.style.display === "") {
        console.log("Ad started playing");
        clickSkipButton();
      } else {
        console.log("Ad ended");
        clearInterval(intervalId);
      }
    }
  }

  // Function to handle changes in the style property of the target element
  function handleStyleChanges(mutationsList) {
    console.log("handleStyleChanges detected.");
    console.log("mutationsList: ", mutationsList);
    console.log("mutationsList.style", mutationsList[0].target.style.display);
    if (mutationsList[0].target.style.display === "") {
      console.log("Ad started playing");
      clickSkipButton();
    } else {
      console.log("Ad ended");
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
      console.log("progress bar found");
      console.log("adProgressBar display value: ", adProgressBar.style.display);
      if (adProgressBar.style.display === "") {
        clickSkipButton();
      }
      observer.observe(adProgressBar, {
        attributes: true,
        attributeOldValue: true, // Record old values
        attributeFilter: ["style"], // Only watch for changes in the 'style' attribute
      });
      console.log("observer started");
    } else {
      console.log("progress bar not found");
      console.log("Retrying...");
      setTimeout(startObserving, 500);
    }
  }
}
// Start observing
startObserving();
