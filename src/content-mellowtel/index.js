import Mellowtel from "mellowtel";

async function initMellowtelContentScript() {
  const config_key = process.env.MELLOWTEL_API_KEY;
  const mellowtel = new Mellowtel(config_key);
  await mellowtel.initContentScript();
  console.log("initMellowtelContentScript", mellowtel);
}

initMellowtelContentScript();
