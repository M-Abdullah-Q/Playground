"use client"
import { useState } from 'react'
import { Settings, Code2, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card } from '../components/ui/card'
import CodeEditor from '@/components/CodeEditor'
import Header from '@/components/Header'
import IOspace from '@/components/IOspace'
import RunButton from '@/components/RunButton'
import LanguageSelector from '@/components/LanguageSelector'

export default function Home() {

  const [currentLanguage, setCurrentLanguage] = useState('javascript')
  const [code, setCode] = useState(getDefaultCode(currentLanguage))

  function getDefaultCode(lang: string) {
    switch (lang) {
      case 'javascript':
        return '// Write your JavaScript code here\n\n';
      case 'python':
        return '# Write your Python code here\n\n';
      case 'java':
        return 'public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}';
      default:
        return '// Write your code here\n';
    }
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    setCode(getDefaultCode(language))
    console.log(currentLanguage);
  }

  const handleRun = () => {
    console.log("run clicked");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header></Header>

      {/* Run Button */}
      <RunButton handleRun={handleRun}/>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-2 grid grid-cols-2 gap-6 h-[calc(100vh-73px)]">
        {/* Problem Statement */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
          <div className="prose dark:prose-invert">
            <p>Write a function that...</p>
          </div>
        </Card>

        {/* Code Editor and I/O */}
        <div className="flex flex-col gap-6">
          <Card className="p-4 flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
              <div className='py-2 items-center'>
              <LanguageSelector 
                onLanguageChange={handleLanguageChange} 
                className="mx-auto" // optional custom classes
              />
              </div>
            </div>
            <div className="">
              <CodeEditor code={code} language={currentLanguage} />
            </div>
          </Card>

          <IOspace></IOspace>
        </div>
      </div>
    </div>
  )
}