function TheTextRaw({ text, fontSize, dir }) {
  return (
    <div
      suppressContentEditableWarning={true}
      dir={dir}
      style={{
        fontSize: `${fontSize}rem`,
        whiteSpace: "pre-wrap",
        outline: "none",
      }}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      contentEditable>
      {text}
    </div>
  );
}

export default TheTextRaw;
