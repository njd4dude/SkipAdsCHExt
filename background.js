// when the url changes on youtube page, execute the content.js script again
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    console.log("URL changed: ", details.url);
    if (details.url.includes("youtube.com/watch")) {
      console.log("includes works!");
      try {
        console.log("details.tabid: ", details.tabId);
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: ["content.js"],
        });
      } catch (error) {
        console.error("Error in executing script: ", error);
      }
    }
  },
  { url: [{ hostSuffix: "youtube.com" }] }
);
