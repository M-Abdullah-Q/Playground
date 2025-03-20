"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Trophy, Zap, ArrowBigUpDash, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { QuestionInput } from "./QuestionInput"

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Blazing-Fast Execution",
    description: "Lightning-fast code execution for seamless problem-solving and instant feedback."
  },
  {
    icon: <ArrowBigUpDash className="h-6 w-6" />,
    title: "Boost Your Rating",
    description: "Accelerate your progress with better contest performance"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Support",
    description: "Sharpen your skills with regular contests, mock interviews, and real-world challenges. Coming Soon..."
  }
];


export function HeroSection() {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Competitive Programming made easier
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Code faster, rank higher—accelerate your algorithmic journey!
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