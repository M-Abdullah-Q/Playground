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
  setFunctions: (functions: Record<string,string> | null) => void;
  isDefault: boolean;
  setIsDefault: (isDefault: boolean) => void;
  defaultCode: Record<string, string>;
  setDefaultCode: (defaultCode : Record<string, string>) => void;
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
  const [defaultCode, setDefaultCode] = useState<Record<string, string>>({
    "cpp": `#include <iostream>
  
  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`,
  
    "java": `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`,
  
    "javascript": `function main() {
      console.log("Hello, World!");
  }
  
  main();`,
  
    "python": `def main():
      print("Hello, World!")
  
  if __name__ == "__main__":
      main()`
  });
  
  const [isDefault, setIsDefault] = useState<boolean>(true);

  return (
    <CodeContext.Provider
      value={{ languages, language, setLanguage, languageId, setLanguageId, boilerplates, code, setCode, setBoilerplates, functions, setFunctions, fullBoilerplates, setFullBoilerplates, defaultCode, setDefaultCode, isDefault, setIsDefault}}
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
