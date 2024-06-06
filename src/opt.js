import Mellowtel from "mellowtel";

document.querySelector("#optIn").addEventListener("click", async (event) => {
  console.log("Pressed optIn button");
  const mellowtel = new Mellowtel("a4b864c8");

  await mellowtel.optIn();
  await mellowtel.start();

  const hasOptedIn = await mellowtel.getOptInStatus();
  console.log("mellowtel status: ", { mellowtel, hasOptedIn });
  // window.open("thank_you.html");
  window.location.href = "thank_you.html";
});

document.querySelector("#optOut").addEventListener("click", async (event) => {
  console.log("Pressed optOut button");
  const mellowtel = new Mellowtel("a4b864c8");

  await mellowtel.optOut();

  const hasOptedIn = await mellowtel.getOptInStatus();
  console.log("mellowtel status: ", { mellowtel, hasOptedIn });
  window.location.href = "thank_you.html";
});
