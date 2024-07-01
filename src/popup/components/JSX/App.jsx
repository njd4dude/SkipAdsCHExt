import React, { useEffect, useState } from "react";
import icon from "/public/icons/128x128.png";
// task 6/28: just finished creating the base ui for the popup need to add the speed up ad toggle button too!
import ToggleSwitch from "./ToggleSwitch";

const App = () => {
  const [adSkip, setAdSkip] = useState(false);
  const [videoPlayBackRate, setVideoPlayBackRate] = useState(false);

  useEffect(() => {
    // task : question -> should this be in the toggle button component?
    const onLoad = async () => {
      const skip_ads_state = (await chrome.storage.local.get("skip_ads"))[
        "skip_ads"
      ];
      const speed_up_state = (await chrome.storage.local.get("speed_up"))[
        "speed_up"
      ];
      console.log("Current state: ", skip_ads_state);
      console.log("speed up state: ", speed_up_state);

      // if its the users first time, by default set the skip_ads to true
      if (skip_ads_state === undefined) {
        console.log("current state is undefined");
        await chrome.storage.local.set({ skip_ads: true });
        await chrome.storage.local.set({ speed_up: true });
        setAdSkip(true);
        setVideoPlayBackRate(true);
      } else {
        // if its not the users first time, set to current state from storage
        console.log("current state is not undefined");
        setAdSkip(skip_ads_state);
        setVideoPlayBackRate(speed_up_state);
      }
    };
    onLoad();
  }, []);

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
      <ToggleSwitch
        name={"Skip Ads"}
        localStorageName={"skip_ads"}
        state={adSkip}
        setState={setAdSkip}
      />
      <ToggleSwitch
        name={"Speed Up Ad"}
        localStorageName={"speed_up"}
        state={videoPlayBackRate}
        setState={setVideoPlayBackRate}
      />
    </div>
  );
};

export default App;
