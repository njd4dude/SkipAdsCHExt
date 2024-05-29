// when the url changes on youtube page, execute the content.js script again
// before I needed this background script because the content script only activated on /watch but now its on all youtube pages so even if I navigate to another page the content scripts is already running
// when you navigated to a new page on youtube it doesnt activate a new content scirpt 
//  to remove the host permissions i can just send a message to the content script to start observing again
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.url.includes("youtube.com/watch")) {
      try {
        // chrome.scripting.executeScript({
        //   target: { tabId: details.tabId },
        //   files: ["content.js"],
        // });

        // send message here
        (async () => {
          const response = await chrome.tabs.sendMessage(details.tabId, {
            greeting: "hello",
          });
          // do something with response here, not outside the function
          console.log(response);
        })();
      } catch (error) {
        console.error("Error in executing script: ", error);
      }
    }
  },
  { url: [{ hostSuffix: "youtube.com" }] }
);
