"use client"
import { useState } from 'react'
import { Settings, Code2, Play } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card } from '../components/ui/card'

const IOspace = () => {
    const [input, setInput] = useState('')
    return(
        <Card className="p-6">
            <Tabs defaultValue="input" className="h-[200px]">
              <TabsList>
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>
              <TabsContent value="input">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-[140px] bg-muted p-4 rounded-md font-mono"
                  placeholder="Enter input here..."
                />
              </TabsContent>
              <TabsContent value="output">
                <div className="w-full h-[140px] bg-muted p-4 rounded-md font-mono">
                  Output will appear here...
                </div>
              </TabsContent>
            </Tabs>
          </Card>
    )
}

export default IOspace