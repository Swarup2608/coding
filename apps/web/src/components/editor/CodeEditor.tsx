"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, tabSize: 2, padding: { top: 16 } }}
    />
  );
}
