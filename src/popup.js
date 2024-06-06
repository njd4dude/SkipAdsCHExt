document.addEventListener("DOMContentLoaded", async () => {
  const checkbox = document.querySelector("input");

  checkbox.addEventListener("change", () => {
    console.log("changed: ", checkbox.checked);
    chrome.storage.local.set({ skip_ads: checkbox.checked });
  });

  // check the current state of the checkbox from chrome.storage.local
  const current_state = (await chrome.storage.local.get("skip_ads"))[
    "skip_ads"
  ];
  console.log("current_state: ", current_state);
  //   if current_state is undefined just set the checkbox and the local storage to true at firsts
  if (current_state === undefined) {
    console.log("current_state is undefined setting default to true");
    chrome.storage.local.set({ skip_ads: true });
    checkbox.checked = true;
  } else {
    // otherwise just set the checkbox to the current state
    console.log(
      "current_state is defined setting it to current_state value: ",
      current_state
    );
    chrome.storage.local.set({ skip_ads: current_state });
    checkbox.checked = current_state;
  }
});
