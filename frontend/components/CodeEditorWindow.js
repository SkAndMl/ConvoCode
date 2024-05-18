import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = React.memo(({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  useEffect(() => {
    setValue(code);
  }, [code]);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    onChange("code", newValue);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language={language || "python"}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
      />
    </div>
  );
});

export default CodeEditorWindow;