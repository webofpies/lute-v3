// let currentTermDataOrder;

const showHighlights = true;

/** Move to the next/prev candidate determined by the selector.
 * direction is 1 if moving "right", -1 if moving "left" -
 * note that these switch depending on if the language is right-to-left! */
function moveCursor(selector, direction = 1) {
  const firstElement = firstSelectedElement();
  const firstElementOrder =
    firstElement != null ? parseInt(firstElement.dataset.order) : 0;
  let candidates = Array.from(document.querySelectorAll(selector));
  let comparator = function (a, b) {
    return a > b;
  };

  if (direction < 0) {
    candidates = candidates.reverse();
    comparator = function (a, b) {
      return a < b;
    };
  }

  const match = candidates.find((el) =>
    comparator(parseInt(el.dataset.order), firstElementOrder)
  );

  if (match) {
    updateCursor(match);

    // Highlight the word if we're jumping around a lot.
    if (selector !== ".word") {
      // const matchOrder = parseInt(match.dataset.order);
      // const matchClass = `flash_${matchOrder}`;
      // $(match).addClass(`flashtextcopy ${matchClass}`);
      // setTimeout(
      //   () => $(`.${matchClass}`).removeClass(`flashtextcopy ${matchClass}`),
      //   1000
      // );
    }
  }
}

/** First selected/hovered element, or null if nothing. */
function firstSelectedElement() {
  const elements = Array.from(
    document.querySelectorAll(".kwordmarked, .newmultiterm, .wordhover")
  ).sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));

  return elements.length > 0 ? elements[0] : null;
}

/** Update cursor, clear prior cursors. */
function updateCursor(target) {
  document
    .querySelectorAll("span.newmultiterm, span.kwordmarked, span.wordhover")
    .forEach((item) => {
      item.classList.remove("newmultiterm", "kwordmarked", "wordhover");
    });
  removeStatusHighlights();
  target.classList.add("kwordmarked");
  // ! NEED? to save current term data order
  // const currentTermDataOrder = parseInt(target.dataset.order);
  applyStatusClass(target);
  // $(window).scrollTo(target, { axis: "y", offset: -150 });
  // show_term_edit_form(target);
}

/** Remove the status from elements, if not showing highlights. */
function removeStatusHighlights() {
  if (showHighlights) {
    /* Not removing anything, always showing highlights. */
    return;
  }
  Array.from(document.querySelectorAll("span.word")).forEach((item) =>
    item.classList.remove(item.dataset.statusClass)
  );
}

/** Status highlights.
/** Add the data-status-class to the term's classes. */
function applyStatusClass(el) {
  el.classList.add(el.dataset.statusClass);
}

function updateStatusForMarked(new_status) {
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  const updates = [createStatusUpdateHash(new_status, elements)];
  post_bulk_update(updates);
}

function createStatusUpdateHash(new_status, elements) {
  return {
    new_status: new_status,
    termids: elements.map((el) => el.dataset.wid),
  };
}

/**
 * Change status using arrow keys for selected or hovered elements.
 */
function incrementStatusForMarked(shiftBy) {
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;

  const statuses = [
    "status0",
    "status1",
    "status2",
    "status3",
    "status4",
    "status5",
    "status99",
  ];

  // Build payloads to update for each unique status that will be changing
  let status_elements = statuses.reduce((obj, status) => {
    obj[status] = [];
    return obj;
  }, {});

  elements.forEach((element) => {
    let s = element.dataset.statusClass ?? "missing";
    if (s in status_elements) status_elements[s].push(element);
  });

  // Convert map to update hashes.
  let updates = [];

  Object.entries(status_elements).forEach(([status, update_elements]) => {
    if (update_elements.length == 0) return;

    let status_index = statuses.indexOf(status);
    let new_index = status_index + shiftBy;
    new_index = Math.max(0, Math.min(statuses.length - 1, new_index));
    let new_status = Number(statuses[new_index].replace(/\D/g, ""));

    // Can't set status to 0 (that is for deleted/non-existent terms only).
    // TODO delete term from reading screen: setting to 0 could equal deleting term.
    if (new_index != status_index && new_status != 0) {
      updates.push(createStatusUpdateHash(new_status, update_elements));
    }
  });

  post_bulk_update(updates);
}

/** THEMES AND HIGHLIGHTS *************************/
/* Change to the next theme, and reload the page. */
function goToNextTheme() {
  $.ajax({
    url: "/theme/next",
    type: "post",
    dataType: "JSON",
    contentType: "application/json",
    success: function () {
      location.reload();
    },
    error: function (response, status, err) {
      const msg = {
        response: response,
        status: status,
        error: err,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    },
  });
}

function post_bulk_update(updates) {
  if (updates.length == 0) {
    // console.log("No updates.");
    return;
  }
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;
  const firtstEl = elements[0];
  const firstStatus = updates[0].new_status;
  const selectedIds = Array.from(
    document.querySelectorAll("span.kwordmarked")
  ).map((el) => el.getAttribute("id"));

  const data = JSON.stringify({ updates: updates });

  function remarkSelectedIds() {
    selectedIds.forEach((id) => {
      const element = document.getElementById(id);
      element.classList.add("kwordmarked");
    });

    if (selectedIds.length > 0) {
      Array.from(document.querySelectorAll("span.wordhover")).forEach(
        (element) => {
          element.classList.remove("wordhover");
        }
      );
    }
  }

  // let reload_text_div = function () {
  //   const bookid = $("#book_id").val();
  //   const pagenum = $("#page_num").val();
  //   const url = `/read/renderpage/${bookid}/${pagenum}`;
  //   const repel = $("#thetext");
  //   repel.load(url, remarkSelectedIds);
  // };

  $.ajax({
    url: "/term/bulk_update_status",
    type: "post",
    data: data,
    dataType: "JSON",
    contentType: "application/json",
    success: function () {
      // reload_text_div();
      if (elements.length == 1) {
        update_term_form(firtstEl, firstStatus);
      }
    },
    error: function (response, status, err) {
      const msg = {
        response: response,
        status: status,
        error: err,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    },
  });
}

/**
 * If the term editing form is visible when reading, and a hotkey is hit,
 * the form status should also update.
 */
function update_term_form(el, new_status) {
  const sel = 'input[name="status"][value="' + new_status + '"]';
  var radioButton = top.frames.wordframe.document.querySelector(sel);
  if (radioButton) {
    radioButton.click();
  } else {
    // Not found - user might just be hovering over the element,
    // or multiple elements selected.
    // console.log("Radio button with value " + new_status + " not found.");
  }
}

export {
  moveCursor,
  incrementStatusForMarked,
  updateStatusForMarked,
  goToNextTheme,
};
