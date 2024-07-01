import React from "react";

const ToggleSwitch = ({ name, localStorageName, state, setState }) => {
  const handleCheckbox = async (e) => {
    console.log(name, e.target.checked);
    chrome.storage.local.set({ [localStorageName]: e.target.checked });
    setState(e.target.checked);
  };

  return (
    <div className="button-container flex justify-center items-center mt-2 h-12 w-full">
      <h3 className="text-sm text-[#c7c7c7] font-bold mr-4 ">{name}</h3>
      <div className="relative w-16 h-8">
        <input
          type="checkbox"
          className="absolute h-full w-full cursor-pointer"
          checked={state}
          onChange={(e) => handleCheckbox(e)}
        />
        <span
          className={`pointer-events-none slider block w-full h-full ${state ? "bg-blue-500" : "bg-gray-400"} transition duration-200 rounded-full relative`}
        >
          <span
            className={`absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition duration-200 transform ${
              state ? "translate-x-8" : ""
            }`}
          ></span>
          <p
            className={`absolute text-xs font-bold right-2.5 top-1.5 text-white transition duration-200 ${state ? "translate-x-8 " : ""}`}
          >
            OFF
          </p>
          {/* this is here for cosmetics makes it so that it looks like "OFF" is sliding behind the background */}
          <div className="absolute w-12 h-12 -right-12 -bottom-2 bg-[#272625] "></div>
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
