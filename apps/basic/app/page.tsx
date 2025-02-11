"use client"
import Header from "@repo/ui/Header";
import Container from "@repo/ui/Container"
import { useState } from "react";


export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Playground</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Column */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <textarea
              className="w-full h-full resize-none p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Input Box */}
            {/* <Container label="Input" value="" placeholder="Enter your input here ..." /> */}
            {/* Output Box */}
            {/* <Container label="Output" value="" placeholder="Your output will appear here ..."/> */}
          </div>
        </div>
      </main>
    </div>
  );
}
