"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function QuestionInput() {
  const [question, setQuestion] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      router.push(`/question?q=${encodeURIComponent(question)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-4">
      <Input
        placeholder="Enter your programming question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">
        Try Now <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}