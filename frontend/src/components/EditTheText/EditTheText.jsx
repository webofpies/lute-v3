function TheTextRaw({ text }) {
  return (
    <div
      // using div because of textarea sizing issues with the panel handle
      suppressContentEditableWarning={true}
      style={{
        fontSize: "inherit",
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
