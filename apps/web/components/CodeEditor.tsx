"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorProps, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
}) as React.FC<EditorProps>;

interface CodeEditorProps{
  code : string
  language : string
}


const CodeEditor = ({code,language} : CodeEditorProps) => {
    const {theme, setTheme} = useTheme();  
    
    return (
        <MonacoEditor
          height="50vh"
          defaultLanguage="javascript"
          language={language}
          value={code}
          theme={theme=='dark' ? 'vs-dark' : 'birds-of-paradise'}
          options={{
                minimap : {
                    enabled : false
                }
            }
          }
        />
      );
};

export default CodeEditor;
