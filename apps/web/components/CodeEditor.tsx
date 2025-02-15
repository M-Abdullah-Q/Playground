"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorProps, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCodeContext } from "./CodeProvider";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
}) as React.FC<EditorProps>;

const CodeEditor = () => {
  const { theme } = useTheme();
  const { language, boilerplates, code, setCode } = useCodeContext();

  // Update code when the language changes
  useEffect(() => {
    setCode(boilerplates[language] || "");
  }, [language, boilerplates, setCode]);

  // Update the editor value when the language changes
  useEffect(() => {
    setCode(boilerplates[language] || "");
  }, [language, boilerplates]);

  return (
    <MonacoEditor
      height="50vh"
      defaultLanguage="javascript"
      language={language}
      value={code}
      onChange={(newCode) => setCode(newCode || "")}
      theme={theme === "dark" ? "vs-dark" : "birds-of-paradise"}
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

export default CodeEditor;
