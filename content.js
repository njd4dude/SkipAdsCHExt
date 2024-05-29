// 5/28 need to revaluate permissions in manifest.json and if I really need them all
{
  let intervalId;
  function clickSkipButton() {
    intervalId = setInterval(function () {
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
        console.log("Skip button found! Clicking it...");
        skip_button.click();
      }
    }, 1000);
  }

  // Function to handle changes in the style property of the target element
  function handleStyleChanges(mutationsList) {
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
    console.log("started to obsverve");
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
}
// Start observing
startObserving();
