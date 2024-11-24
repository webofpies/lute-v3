function Sentences({ references, text }) {
  return (
    <div>
      {references.length === 0 ? (
        <div>
          <p>No references found for &quot;{text}&quot;:</p>
          <ul>
            <li>This may be a new term.</li>
            <li>
              The page containing this word may not be marked as
              &quot;read&quot; (see{" "}
              <a
                href="https://luteorg.github.io/lute-manual/faq/terms/sentences-only-shown-when-page-is-read.html"
                target="_blank"
                rel="noopener noreferrer">
                the manual
              </a>
              ).
            </li>
            <li>Books containing this term may have been deleted.</li>
          </ul>
        </div>
      ) : (
        Object.entries(references).map(
          ([k, dtos]) =>
            dtos.length > 0 && (
              <div key={k}>
                <p className="term">{k}</p>
                <ul className="sentencelist">
                  {dtos.map((dto) => (
                    <li key={dto.bookId} style={{ marginTop: "4px" }}>
                      {dto.sentence}
                      <br />
                      <a
                        href={`/read/${dto.bookId}/page/${dto.pageNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          cursor: "pointer",
                          fontSize: "0.9em",
                          fontStyle: "italic",
                        }}>
                        {dto.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )
      )}
    </div>
  );
}

export default Sentences;
