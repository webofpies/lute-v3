import { useEffect } from "react";

function useDocumentTitle(book) {
  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);
}

export default useDocumentTitle;
