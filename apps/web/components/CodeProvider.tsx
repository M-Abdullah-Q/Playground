"use client";

import { createContext, ReactNode, useState, useContext } from "react";

interface Language {
  value: string;
  label: string;
  icon: string;
}

interface CodeContextType {
  languages: Language[];
  language: string;
  setLanguage: (lang: string) => void;
  languageCode: string;
  setLanguageCode: (langCode: string) => void;
  code: string;
  setCode: (code: string) => void;
  boilerplates: Record<string, string>;
}

const languages: Language[] = [
  { value: "cpp", label: "C++", icon: "🔧" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "javascript", label: "JavaScript", icon: "💛" },
  { value: "python", label: "Python", icon: "🐍" },
];

const boilerplates: Record<string, string> = {
  cpp: "#include <iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello, World!\";\n  return 0;\n}",
  java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}",
  javascript: "console.log(\"Hello, World!\");",
  python: "print(\"Hello, World!\")",
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("javascript");
  const [languageCode, setLanguageCode] = useState(boilerplates["javascript"]);
  const [code,setCode] = useState("");

  return (
    <CodeContext.Provider
      value={{ languages, language, setLanguage, languageCode, setLanguageCode, boilerplates, code,setCode}}
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
