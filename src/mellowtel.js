import Mellowtel from "mellowtel";

const config_key = "a4b864c8";

try {
  const mellowtel = new Mellowtel(config_key);
  await mellowtel.initContentScript();
} catch (error) {
  console.error("Error initializing content script for Mellowtel:", error);
}
