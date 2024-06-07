document.addEventListener("DOMContentLoaded", async () => {
  const checkbox = document.querySelector("input");

  checkbox.addEventListener("change", () => {
    chrome.storage.local.set({ skip_ads: checkbox.checked });
  });

  // check the current state of the checkbox from chrome.storage.local
  const current_state = (await chrome.storage.local.get("skip_ads"))[
    "skip_ads"
  ];
  //   if current_state is undefined just set the checkbox and the local storage to true at firsts
  if (current_state === undefined) {
    chrome.storage.local.set({ skip_ads: true });
    checkbox.checked = true;
  } else {
    // otherwise just set the checkbox to the current state

    chrome.storage.local.set({ skip_ads: current_state });
    checkbox.checked = current_state;
  }
});
