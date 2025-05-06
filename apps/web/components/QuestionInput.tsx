"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input"

export function QuestionInput() {
  const [question, setQuestion] = useState("")
  const [ongoing, setOngoing] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      setTimeout(() => {
        router.push(`/question?q=${encodeURIComponent(question)}&ongoing=${encodeURIComponent(ongoing)}`)
      }, 300)
    }
  }

  const placeholders = ['Enter a CodeForces problem ...', 'Lets get Solving...']

  return (
    <div className="max-w-2xl mx-auto flex gap-4 items-center">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={(e) => setQuestion(e.target.value)}
        onSubmit={handleSubmit}
      />
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={ongoing} 
          onChange={(e) => setOngoing(!ongoing)} 
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <div className="opacity-100 text-muted-foreground">Ongoing Contest?</div>
      </label>
    </div>
  )
}
