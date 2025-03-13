"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorProps, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useCodeContext } from "../providers/CodeProvider";
import { useQuestionContext } from "@/providers/QuestionProvider";
import axios from "axios";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
}) as React.FC<EditorProps>;

const CodeEditor = () => {
  const { theme } = useTheme();
  const { language, boilerplates, setBoilerplates, code, setCode, functions, setFunctions } = useCodeContext();
  const { inputDescription, outputDescription, title} = useQuestionContext();

  useEffect(() => {

    console.log("Boilerplates in CodeEditor:", boilerplates);
    console.log("Functions in CodeEditor:", functions);


    //use the input and output description to send an api request on mount only
    // const fetchData = async () => {
    //   try {
    //     console.log('reached here')
    //     const response = await axios.post("/api/generator", {
    //       inputDescription,
    //       outputDescrition,
    //       title,
    //     });
    //     console.log('anon check ')

    //     //update the context
    //     const {boilers, funcs} = response.data;
    //     setBoilerplates(boilers);
    //     setFunctions(funcs)

    //   } catch (error) {
    //     console.error("API Request Failed:", error);
    //   }
    // };
    // if(!inputDescription){
    //   fetchData();
    // }
    setCode(functions?.[language] || "");
  }, [language, boilerplates]);

  return (
    <MonacoEditor
      height="50vh"
      defaultLanguage="javascript"
      language={language}
      value={code || ''}
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
