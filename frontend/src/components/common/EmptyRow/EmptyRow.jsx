import { Link } from "react-router-dom";

function EmptyRow({ tableName, language, languageChoices }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      No {tableName} found for <strong>{language}</strong>.{" "}
      <Link
        to={`/${tableName}/new?id=${languageChoices.filter((lang) => lang.name === language)[0].id}`}>
        Create one?
      </Link>
    </div>
  );
}

export default EmptyRow;
