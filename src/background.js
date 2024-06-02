// 6/1 left off here nee to add more the onboarding page to specify what the users are actually agreeeing to. Also trying to figure out what
// is happening with the permissions since its saying request additonal permission to read and change all data on websites 
// This is probably due to the fact that the manifest file is requestin <all_urls> permission for the mellowtel.js and the optional permissions and the opitonal host permissions
// which this basically says all websites -> ["https://*/*"]
import Mellowtel from "mellowtel";

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed");
  const currentVersion = chrome.runtime.getManifest().version;
  const newVersionKey = "newVersion";
  const updateShownKey = "updateShown";

  // Check if this is a new version of the extension
  const previousVersion = await getFromStorage(newVersionKey);
  console.log("previousVersion: ", previousVersion);
  console.log("currentVersion: ", currentVersion);
  if (currentVersion !== previousVersion) {
    console.log("--New version detected--");
    console.log("-----------PROCESS----------------");
    console.log("Updated from version", previousVersion, "to", currentVersion);
    // Save the new version to local storage
    await setInStorage(newVersionKey, currentVersion);

    // Check if we've already shown the update notification for this version
    const updateShown = await getFromStorage(updateShownKey);
    console.log("updateShown: ", updateShown);
    if (!updateShown) {
      // Open a new tab with the update page
      console.log("opening onboarding tab...");
      chrome.tabs.create({ url: "onboarding.html" }); // this page has the optIn button?

      // Set the flag so we don't show the update notification again
      await setInStorage(updateShownKey, true);
    }
    console.log("-----------PROCESS----------------");
  } else {
    console.log("No new version detected");
  }
});

await initMel();
// Function to initialize Mellowtel
async function initMel() {
  try {
    const mellowtel = new Mellowtel("a4b864c8");
    await mellowtel.initBackground();
    const hasOptedIn = await mellowtel.getOptInStatus();

    console.log("mellowtel initBackground: ", { mellowtel, hasOptedIn });
  } catch (error) {
    console.error("Error initializing Mellowtel:", error);
  }
}

// Helper function to get data from storage
function getFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], function (result) {
      resolve(result[key]);
    });
  });
}

// Helper function to set data in storage
function setInStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, function () {
      resolve();
    });
  });
}
