import React, { useEffect, useState } from "react";
import icon from "/public/icons/128x128.png";
import ToggleSwitch from "./ToggleSwitch";
import Mellowtel from "mellowtel";

const App = () => {
  const [speedUp, setSpeedUp] = useState(false);
  const [muteAd, setMuteAd] = useState(false);

  const [settingsLink, setSettingsLink] = useState("");

  useEffect(() => {
    // task : question -> should this be in the toggle button component?

    async function generateOptLink() {
      const config_key = process.env.MELLOWTEL_API_KEY;
      const mellowtel = new Mellowtel(config_key);
      const link = await mellowtel.generateSettingsLink();
      setSettingsLink(link);
    }
    generateOptLink();
  }, []);

  const handleSettingsLinkClick = () => {
    if (settingsLink) {
      chrome.tabs.create({ url: settingsLink });
    }
  };

  return (
    <div className="bg-[#272625] w-72 h-60 p-4 overflow-hidden relative">
      <div className="flex justify-center items-center w-full h-1/3">
        <img className="w-6 object-contain mr-1" src={icon} alt="icon" />
        <h1 className="title text-white text-xl font-bold ">
          Youtube Ad Speedster
        </h1>
      </div>
      <div className="w-full">
        <ToggleSwitch
          name={"Speed Up Ad"}
          localStorageName={"speed_up"}
          state={speedUp}
          setState={setSpeedUp}
        />
        <ToggleSwitch
          name={"Mute Ad"}
          localStorageName={"mute_ads"}
          state={muteAd}
          setState={setMuteAd}
        />
      </div>
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
