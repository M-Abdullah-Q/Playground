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
  code: string;
  setCode: (code: string) => void;
  boilerplates: Record<string, string>;
  setBoilerplates: React.Dispatch<React.SetStateAction<{ "cpp": string; "java": string; "javascript": string; "python": string; }>>;
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
  const [boilerplates, setBoilerplates] = useState({
    "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello, World!\";\n  return 0;\n}",
    "java": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}",
    "javascript": "console.log(\"Hello, World!\");",
    "python": "print(\"Hello, World!\")",
  });
  const [languageId,setLanguageId] = useState("102");
  const [code,setCode] = useState(boilerplates["javascript"]);

  return (
    <CodeContext.Provider
      value={{ languages, language, setLanguage, languageId, setLanguageId, boilerplates, code, setCode, setBoilerplates}}
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
