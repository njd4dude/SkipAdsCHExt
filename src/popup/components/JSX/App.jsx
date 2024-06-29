import React, { useEffect, useState } from "react";
import icon from "/public/icons/128x128.png";
// task 6/28: just finished creating the base ui for the popup need to add the speed up ad toggle button too!


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
    <div className="bg-[#272625] w-52 h-52 p-4 overflow-hidden">
      <div className="flex justify-center items-center w-full h-1/3">
        <img
          className="w-6 object-contain mr-1"
          src={icon}
          alt="Ad Skipper Icon"
        />
        <h1 className="title text-white text-2xl font-bold">Ad Skipper</h1>
      </div>
      <div className="flex justify-center items-center mt-2 h-12 w-full">
        <h3 className="text-sm text-[#c7c7c7] font-bold mr-4 ">Skip Ads</h3>
        <div className="flex">
          <div className="relative w-16 h-8">
            <input
              type="checkbox"
              className="absolute h-full w-full cursor-pointer"
              checked={isChecked}
              onChange={(e) => handleCheckbox(e)}
            />
            <span
              className={`pointer-events-none slider block w-full h-full ${isChecked ? "bg-blue-500" : "bg-gray-400"} transition duration-200 rounded-full relative`}
            >
              <span
                className={`absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition duration-200 transform ${
                  isChecked ? "translate-x-8" : ""
                }`}
              ></span>
              <p
                className={`absolute text-xs font-bold right-2.5 top-1.5 text-white transition duration-200 ${isChecked ? "translate-x-8 " : ""}`}
              >
                OFF
              </p>
              {/* this is here for cosmetics makes it so that it looks like "OFF" is sliding behind the background */}
              <div className="absolute w-12 h-12 -right-12 -bottom-2 bg-[#272625] "></div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
