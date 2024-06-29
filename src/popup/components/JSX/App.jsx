import React, { useEffect, useState } from "react";
import "../CSS/App.css";
// task implement tailwind css 6/28

const App = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const onFirstLoad = async () => {
      const current_state = (await chrome.storage.local.get("skip_ads"))[
        "skip_ads"
      ];
      console.log("Current state: ", current_state);

      // if its the users first time, by default set the skip_ads to true
      if (current_state === undefined) {
        console.log("current state is undefined");
        chrome.storage.local.set({ skip_ads: true });
        setIsChecked(true);
      } else {
        // if its not the users first time, set the skip_ads to the current state
        console.log("current state is not undefined");
        chrome.storage.local.set({ skip_ads: current_state });
        setIsChecked(current_state);
      }
    };
    onFirstLoad();
  }, []);

  const handleCheckbox = async (e) => {
    console.log("Checkbox clicked", e.target.checked);
    chrome.storage.local.set({ skip_ads: e.target.checked });
    setIsChecked(e.target.checked);
  };

  return (
    <div>
      <h1 className="title text-red-600 ">Ad Skipper</h1>
      <div className="switch-holder">
        <h3 className="switch-name text-blue-500">Skip Ads</h3>
        <label className="switch">
          <input
            checked={isChecked}
            onChange={(e) => handleCheckbox(e)}
            type="checkbox"
          />
          <span className="slider round">
            <span className="toggle-circle"></span>
          </span>
          <p className="toggle-text unselectable">OFF</p>
        </label>
      </div>
    </div>
  );
};

export default App;
