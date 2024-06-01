import Mellowtel from "mellowtel";

const config_key = "a4b864c8";

const mellowtel = new Mellowtel(config_key);
await mellowtel.initContentScript();
