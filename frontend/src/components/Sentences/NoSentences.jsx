function NoSentences({ text }) {
  return (
    <div>
      <p>No references found for &quot;{text}&quot;:</p>
      <ul>
        <li>This may be a new term.</li>
        <li>
          The page containing this word may not be marked as &quot;read&quot;
          (see{" "}
          <a
            to="https://luteorg.github.io/lute-manual/faq/terms/sentences-only-shown-when-page-is-read.html"
            target="_blank"
            rel="noopener noreferrer">
            the manual
          </a>
          ).
        </li>
        <li>Books containing this term may have been deleted.</li>
      </ul>
    </div>
  );
}

export default NoSentences;
