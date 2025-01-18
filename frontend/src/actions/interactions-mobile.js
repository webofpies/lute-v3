/********************************************/
// Mobile events.
//
// 1. Regular vs long taps.
//
// Ref https://borstch.com/blog/javascript-touch-events-and-mobile-specific-considerations
//
// I had used https://github.com/benmajor/jQuery-Touch-Events, but
// during development was running into problems with chrome dev tool
// mobile emulation freezing.  I thought it was the library but the
// problem occurred with the vanilla js below.
//
// https://stackoverflow.com/questions/22722727/
// chrome-devtools-mobile-emulation-scroll-not-working suggests that
// it's a devtools problem, and I agree, as it occurred at random.
// I'm still sticking with the vanilla js below though: it's very
// simple, and there's no need to add another dependency just to
// distinguish regular and long taps.
//
// 2. Single tap vs double tap
//
// For my iphone at least, double-tap didn't seem to work, even though
// it did in chrome devtools emulation.  For my iphone, the phone
// browser seemed to add a delay after each click, so the double
// clicks were never fast enough to be distinguishable.  For that
// reason, instead of using click time differences to distinguish
// between single and double clicks, the code tracks the
// _last_touched_element: if the second tap is the same as the first,
// it's treated as a double tap, regardless of the duration.  This is
// fine for Lute since the first tap only opens the term pop-up.
//
// 3. Scroll/swipe
//
// Swipes have to be tracked because each swipe starts with a touch,
// which gets confused with the other events.  If the touch start and
// end differ by a threshold amount, assume the user is scrolling.

// Tracking if long tap.
let _touch_start_time;
const _long_touch_min_duration_ms = 500;

// Tracking if double-click.
let _last_touched_element_id = null;

// Tracking if swipe.
let _touch_start_coords = null;
const _swipe_min_threshold_pixels = 15;

function _get_coords(touch) {
  var touchX = touch.clientX;
  var touchY = touch.clientY;
  // console.log('X: ' + touchX + ', Y: ' + touchY);
  return [touchX, touchY];
}

function _swipe_distance(e) {
  const curr_coords = _get_coords(e.originalEvent.changedTouches[0]);
  const dX = curr_coords[0] - _touch_start_coords[0];
  const dY = curr_coords[1] - _touch_start_coords[1];
  return Math.sqrt(dX * dX + dY * dY);
}

function touch_started(e) {
  _touch_start_coords = _get_coords(e.originalEvent.touches[0]);
  _touch_start_time = Date.now();
}

function touch_ended(e) {
  if (_swipe_distance(e) >= _swipe_min_threshold_pixels) {
    // Do nothing else if this was a swipe.
    return;
  }

  // The touch_ended handler is attached with t.on in
  // prepareTextInteractions, so the clicked element is just
  // $(this).
  const el = $(this);
  const this_id = el.attr("id");

  $("span.kwordmarked").removeClass("kwordmarked");
  $("span.wordhover").removeClass("wordhover");

  const touch_duration = Date.now() - _touch_start_time;
  const is_long_touch = touch_duration >= _long_touch_min_duration_ms;
  const is_double_click = this_id === _last_touched_element_id;
  _last_touched_element_id = null; // Already checked in is_double_click.

  if (is_long_touch) {
    _tap_hold(el, e);
  } else if (selection_start_el != null) {
    select_over(el, e);
    select_ended(el, e);
  } else if (is_double_click) {
    _double_tap(el);
  } else {
    _single_tap(el);
    _last_touched_element_id = this_id;
    el.addClass("kwordmarked");
  }
}

// Tap-holds define the start and end of a multi-word term.
function _tap_hold(el, e) {
  // console.log('hold tap');
  if (selection_start_el == null) {
    select_started(el, e);
    select_over(el, e);
  } else {
    select_over(el, e);
    select_ended(el, e);
  }
}

// Show the form.
function _double_tap(el, e) {
  // console.log('double tap');
  $(".ui-tooltip").css("display", "none");
  clear_newmultiterm_elements();
  show_term_edit_form(el);
}

function _single_tap(el, e) {
  // console.log('single tap');
  clear_newmultiterm_elements();
  const term_is_status_0 = el.data("status-class") == "status0";
  if (term_is_status_0) {
    show_term_edit_form(el);
  }
}

/**
 * Prepare the interaction events with the text.
 */
function prepareTextInteractions() {
  if (_isUserUsingMobile()) {
    console.log("Using mobile interactions");
    _add_mobile_interactions();
  } else {
    console.log("Using desktop interactions");
    _add_desktop_interactions();
  }

  $(document).on("keydown", handle_keydown);

  $("#thetext").tooltip({
    position: _get_tooltip_pos(),
    items: ".word",
    show: { easing: "easeOutCirc" },
    content: function (setContent) {
      tooltip_textitem_hover_content($(this), setContent);
    },
  });
}

function _add_mobile_interactions() {
  const t = $("#thetext");
  t.on("touchstart", ".word", touch_started);
  t.on("touchend", ".word", touch_ended);
}

/**
 * Find if on mobile.
 *
 * This appears to still be a big hassle.  Various posts
 * say to not use the userAgent sniffing, and use feature tests
 * instead.
 * ref: https://stackoverflow.com/questions/72502079/
 *   how-can-i-check-if-the-device-which-is-using-my-website-is-a-mobile-user-or-no
 * From the above, using answer from marc_s: https://stackoverflow.com/a/76055222/1695066
 *
 * The various answers posted are still incorrect in certain cases,
 * so Lute users can set the screen_interactions_type for the session.
 */
const _isUserUsingMobile = () => {
  const s = localStorage.getItem("screen_interactions_type");
  if (s == "desktop") return false;
  if (s == "mobile") return true;

  // User agent string method
  let isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Screen resolution method.
  // Using the same arbitrary width check (980) as used
  // by the various window.matchMedia checks elsewhere in the code.
  // The original method in the SO post had width, height < 768,
  // but that broke playwright tests which opens a smaller browser window.
  if (!isMobile) {
    isMobile = window.screen < 980;
  }

  // Disabling this check - see https://stackoverflow.com/a/4819886/1695066
  // for the many cases where this fails.
  // Touch events method
  // if (!isMobile) {
  //   isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  //  }

  // CSS media queries method
  if (!isMobile) {
    let bodyElement = document.getElementsByTagName("body")[0];
    isMobile =
      window
        .getComputedStyle(bodyElement)
        .getPropertyValue("content")
        .indexOf("mobile") !== -1;
  }

  return isMobile;
};
