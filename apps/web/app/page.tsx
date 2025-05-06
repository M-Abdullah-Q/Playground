import Header from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { FloatingElements } from "@/components/FloatingElements"

export default function Home() {
  return (
    <main>
      <FloatingElements />
      <Header />
      <HeroSection />
    </main>
  )
}