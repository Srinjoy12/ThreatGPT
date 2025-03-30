"use client"

import DocumentUpload from "@/components/document-uploader"
import AiChatInterface from "@/components/ai-chat"

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full md:w-1/2 border-r border-gray-800">
        <DocumentUpload />
      </div>
      <div className="w-full md:w-1/2">
        <AiChatInterface />
      </div>
    </div>
  )
}

