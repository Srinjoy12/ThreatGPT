"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DocumentUpload from "@/components/document-uploader"
import AiChatInterface from "@/components/ai-chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth.tsx"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            ThreatGPT
          </h1>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 border border-gray-200 dark:border-gray-800">
          <div className="border-0 md:border-r border-gray-200 dark:border-gray-800">
            <DocumentUpload />
          </div>
          <div>
            <AiChatInterface />
          </div>
        </div>
      </div>
    </div>
  )
}

