import { isLightColor } from "@mantine/core";

/** THEMES AND HIGHLIGHTS *************************/
/* Change to the next theme, and reload the page. */
function goToNextTheme() {
  fetch("/theme/next", {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
  })
    .then((response) => {
      if (!response.ok) {
        // If the response is not ok, reject the promise
        return Promise.reject("Failed to load next theme");
      }
      return response.json(); // Parse the response as JSON
    })
    .then(() => {
      location.reload(); // Reload the page on success
    })
    .catch((error) => {
      // Handle any errors
      const msg = {
        error: error,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    });
}

function applyLuteHighlights(colors, scheme) {
  const root = document.querySelector(
    `:root[data-mantine-color-scheme="${scheme}"]`
  );

  Object.keys(colors).forEach((value) => {
    root.style.setProperty(
      `--lute-color-highlight-${value}`,
      colors[value][scheme]
    );

    document.querySelectorAll(`.${value}`).forEach((textitem) => {
      textitem.dataset.highlightType = colors[value].type;
    });

    setTextColor(value, colors[value][scheme], root);
  });
}

function setTextColor(id, color, root) {
  root.style.setProperty(
    `--lute-text-color-${id}`,
    isLightColor(color)
      ? "var(--mantine-color-dark-7)"
      : "var(--mantine-color-dark-0)"
  );
}

export { goToNextTheme, applyLuteHighlights, setTextColor };
