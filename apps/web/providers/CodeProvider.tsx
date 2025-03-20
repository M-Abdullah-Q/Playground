"use client";

import { createContext, ReactNode, useState, useContext } from "react";

interface Language {
  value: string;
  label: string;
  id: string;
}

interface CodeContextType {
  languages: Language[];
  language: string;
  setLanguage: (lang: string) => void;
  languageId: string;
  setLanguageId: (langCode: string) => void;
  code: string | null;
  setCode: (code: string | null) => void;
  boilerplates: Record<string, string> | null;
  setBoilerplates: (boilerplates: Record<string,string> | null) => void;
  fullBoilerplates:  Record<string,string> | null;
  setFullBoilerplates: (fullBoilerplates: Record<string, string> | null) => void;
  functions: Record<string, string> | null;
  setFunctions: (functions: Record<string,string> | null) => void
}

const languages: Language[] = [
  { value: "cpp", label: "C++", id: "54"},
  { value: "java", label: "Java", id: "91"},
  { value: "javascript", label: "JavaScript", id:"102"},
  { value: "python", label: "Python", id: "100"},
];

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("javascript");
  const [boilerplates, setBoilerplates] = useState<Record<string,string> | null>(null);
  const [fullBoilerplates, setFullBoilerplates] = useState<Record<string,string> | null>(null);
  const [languageId,setLanguageId] = useState("102");
  const [code,setCode] = useState<string | null>(null);
  const [functions, setFunctions] = useState<Record<string,string> | null>(null);

  return (
    <CodeContext.Provider
      value={{ languages, language, setLanguage, languageId, setLanguageId, boilerplates, code, setCode, setBoilerplates, functions, setFunctions, fullBoilerplates, setFullBoilerplates}}
    >
      {children}
    </CodeContext.Provider>
  );
}

export function useCodeContext() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
}
