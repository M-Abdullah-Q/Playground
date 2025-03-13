"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface TestType {
  input: string;
  output: string;
}

interface QuestionContextType {
  title: string| null;
  setTitle: (title: string| null) => void;
  description: string;
  setDescription: (description: string) => void;
  timeLimit: string;
  setTimeLimit: (timeLimit: string) => void;
  memoryLimit : string;
  setMemoryLimit : (memeoryLimit : string) => void;
  example: string;
  inputDescription: string | null;
  setInputDescription : (ipd : string | null) => void;
  outputDescription: string | null;
  setOutputDescription: (opd: string | null) => void;
  setExample: (example: string) => void;
  tests: TestType[];
  setTests: (test: TestType[]) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {

  const [title, setTitle] = useState<string | null>("Problem Statement");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [memoryLimit, setMemoryLimit] = useState("");
  const [example, setExample] = useState("");
  const [tests, setTests] = useState<TestType[]>([]);
  const [inputDescription,setInputDescription] = useState<string | null>(null);
  const [outputDescription,setOutputDescription] = useState<string | null>(null)
  
  return (
    <QuestionContext.Provider
      value={{ title, setTitle, description, setDescription, timeLimit, setTimeLimit, memoryLimit, setMemoryLimit,inputDescription, setInputDescription, outputDescription, setOutputDescription, example, setExample, tests, setTests }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestionContext() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestionContext must be used within a QuestionProvider");
  }
  return context;
}
