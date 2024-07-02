import React, { useEffect, useState } from "react";
import icon from "/public/icons/128x128.png";
import ToggleSwitch from "./ToggleSwitch";
import Mellowtel from "mellowtel";
// task 7/1 add a settings page where users can opt out
const App = () => {
  const [adSkip, setAdSkip] = useState(false);
  const [videoPlayBackRate, setVideoPlayBackRate] = useState(false);
  const [settingsLink, setSettingsLink] = useState("");

  useEffect(() => {
    // task : question -> should this be in the toggle button component?
    const onLoad = async () => {
      const skip_ads_state = (await chrome.storage.local.get("skip_ads"))[
        "skip_ads"
      ];
      const speed_up_state = (await chrome.storage.local.get("speed_up"))[
        "speed_up"
      ];

      // if its the users first time, by default set the skip_ads to true
      if (skip_ads_state === undefined) {
        await chrome.storage.local.set({ skip_ads: true });
        await chrome.storage.local.set({ speed_up: true });
        setAdSkip(true);
        setVideoPlayBackRate(true);
      } else {
        // if its not the users first time, set to current state from storage
        setAdSkip(skip_ads_state);
        setVideoPlayBackRate(speed_up_state);
      }
    };
    async function generateOptLink() {
      const config_key = process.env.MELLOWTEL_API_KEY;
      const mellowtel = new Mellowtel(config_key);
      const link = await mellowtel.generateSettingsLink();
      setSettingsLink(link);
    }
    onLoad();
    generateOptLink();
  }, []);

  const handleSettingsLinkClick = () => {
    if (settingsLink) {
      chrome.tabs.create({ url: settingsLink });
    }
  };

  return (
    <div className="bg-[#272625] w-56 h-64 p-4 overflow-hidden relative">
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
      {settingsLink && (
        <div className="absolute bottom-2 right-2 text-gray-400">
          <button className=" text-[11px]" onClick={handleSettingsLinkClick}>
            Opt Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
