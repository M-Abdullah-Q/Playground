"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Brain, Code, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { QuestionInput } from "./QuestionInput"

const features = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "300+ DSA Problems",
    description: "Carefully curated problems covering all important algorithms and data structures"
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Smart Learning Path",
    description: "Personalized learning path based on your skill level and progress"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Contest Practice",
    description: "Regular contests and mock interviews to prepare you for real competitions"
  }
]

export function HeroSection() {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Master DSA & Competitive Programming
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          One stop solution for all your algorithmic programming needs. Practice, learn, and compete with the best.
        </p>
        <QuestionInput />
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg bg-card">
              <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}