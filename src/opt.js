import Mellowtel from "mellowtel";

document.querySelector("#optIn").addEventListener("click", async (event) => {
  const mellowtel = new Mellowtel("a4b864c8");

  await mellowtel.optIn();
  await mellowtel.start();

  window.location.href = "thank_you.html";
});

document.querySelector("#optOut").addEventListener("click", async (event) => {
  const mellowtel = new Mellowtel("a4b864c8");

  await mellowtel.optOut();

  window.location.href = "thank_you.html";
});
