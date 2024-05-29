// when the url changes on youtube page, execute the content.js script again
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.url.includes("youtube.com/watch")) {
      try {
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
