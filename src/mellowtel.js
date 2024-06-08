import Mellowtel from "mellowtel";

try {
  const config_key = process.env.MELLOWTEL_API_KEY;
  const mellowtel = new Mellowtel(config_key);
  await mellowtel.initContentScript();
} catch (error) {
  console.error("Error initializing content script for Mellowtel:", error);
}
