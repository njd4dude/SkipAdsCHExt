import Mellowtel from "mellowtel";

document.querySelector("#optIn").addEventListener("click", async (event) => {
  console.log("Pressed optIn button");
  const mellowtel = new Mellowtel("a4b864c8");

  await mellowtel.optIn();
  await mellowtel.start();

  const hasOptedIn = await mellowtel.getOptInStatus();
  console.log("mellowtel status: ", { mellowtel, hasOptedIn });
});
