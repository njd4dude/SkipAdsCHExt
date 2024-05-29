// 5/28 need to revaluate permissions in manifest.json and if I really need them all
{
  let intervalId;
  function clickSkipButton() {
    intervalId = setInterval(function () {
      console.log("skip interval");
      const skip_button = document.querySelector(".ytp-skip-ad-button");
      if (skip_button) {
        skip_button.click();
        console.log("skip button clicked");
      }
    }, 1000);
  }

  // Function to handle changes in the style property of the target element
  function handleStyleChanges(mutationsList) {
    console.log("style changes");
    if (mutationsList[0].target.style.display === "") {
      console.log("ad found");
      clickSkipButton();
    } else {
      console.log("ad ended");
      clearInterval(intervalId);
    }
  }

  // Create a new MutationObserver instance with the callback function
  const observer = new MutationObserver(handleStyleChanges);

  // Function to start observing the target node
  function startObserving() {
    console.log("start observing");
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
      console.log("observing started");
    } else {
      setTimeout(startObserving, 500);
      console.log("not found, retrying in 500ms");
    }
  }
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request: ", request);
  console.log("sender: ", sender);
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
});

// Start observing
startObserving();
