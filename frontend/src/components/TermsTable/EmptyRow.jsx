import { Link } from "react-router-dom";

function EmptyRow({ table }) {
  const language = table.getColumn("language").getFilterValue();
  const isLanguageFiltered = language?.length > 0;

  return (
    isLanguageFiltered && (
      <div style={{ textAlign: "center", padding: "20px" }}>
        No terms found for <strong>{language}</strong>.{" "}
        <Link
          to={`/terms/new?name=${encodeURIComponent(language.replace(/\s/g, "%20"))}`}>
          Create one?
        </Link>
      </div>
    )
  );
}

export default EmptyRow;
