import React from "react";
import "../CSS/App.css";

const App = () => {
  return (
    <div>
      <h1 className="title">Ad Skipper</h1>
      <div className="switch-holder">
        <h3 className="switch-name">Skip Ads</h3>
        <label className="switch">
          <input type="checkbox" />
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
