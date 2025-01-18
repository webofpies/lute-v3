import {
  getMatchedTextItems,
  addClassToElements,
  removeAllContainingClassWithTimeout,
} from "./utils";

function handleBookmarkSentence(textitem) {
  const sentenceId = textitem.dataset.sentenceId;
  const matched = getMatchedTextItems(textitem, "sentence-id");
  addClassToElements(matched, "flash");
  removeAllContainingClassWithTimeout("flash");

  // all_bookmarks = {
  //   book_id: {
  //     page_num: [{ sentence_id: 0, bookmark_description: "" }],
  //   },
  // };
  console.log(`POST sentence id: ${sentenceId} to db`);
}

function handleShowBookmark(sentenceId) {
  const textitem = document.querySelector(
    `[data-sentence-id="${sentenceId}"].sentencestart`
  );
  textitem.scrollIntoView({ behavior: "smooth" });
  const matched = getMatchedTextItems(textitem, "sentence-id");
  setTimeout(() => addClassToElements(matched, "flash"), 300);
  removeAllContainingClassWithTimeout("flash");
}

export { handleBookmarkSentence, handleShowBookmark };
