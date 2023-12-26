"use strict";

window.addEventListener("message", function(event) {
  if (event.data.event === "LuteTermFormOpened") {
    const wordFrame = document.getElementById("wordframeid");
    const wkn = wordFrame.contentDocument.querySelector(`label[for="status-5"]`);
    const ign = wordFrame.contentDocument.querySelector(`label[for="status-6"]`);

    wkn.textContent = "✔";
    ign.textContent = "✖";
  }
});