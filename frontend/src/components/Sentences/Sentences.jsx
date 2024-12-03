import { LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import NoSentences from "./NoSentences";
import classes from "./Sentences.module.css";

function Sentences({ sentencesFetchOptions }) {
  const { data, isSuccess, error } = useQuery(sentencesFetchOptions);
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className={classes.container}>
      {!isSuccess ? (
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      ) : data.variations.length === 0 ? (
        <NoSentences text={data.text} />
      ) : (
        <ul className={classes.mainList}>
          {data.variations.map(
            ({ term, references }) =>
              references.length > 0 && (
                <li key={term}>
                  <p className={classes.term}>{term}</p>
                  <ul className={classes.innerList}>
                    {references.map((reference) => (
                      <li key={reference.id}>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: reference.sentence,
                          }}
                        />
                        <a
                          href={`/books/${reference.bookId}/pages/${reference.pageNumber}`}
                          target="_blank"
                          className={classes.bookLink}>
                          {reference.bookTitle}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
}

export default Sentences;
