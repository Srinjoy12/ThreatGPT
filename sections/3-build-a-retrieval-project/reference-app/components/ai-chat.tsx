"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCompletionWithContext } from "@/lib/rag/generation/generate-completion";
import { runRagPipeline } from "@/lib/rag/retrieval/run-rag-pipeline";
import { useState } from "react";

export default function AiChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [currentDocs, setCurrentDocs] = useState<string[]>([]);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setCurrentDocs([]);

    try {
      const relevantDocs = await runRagPipeline(input);
      const context = relevantDocs.map((doc) => doc.content).join("\n\n");

      setCurrentDocs(relevantDocs.map((doc) => doc.content));
      const answer = await generateCompletionWithContext(context, input);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `${answer}`
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error processing your request."
        }
      ]);
    }

    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">AI Chat</h2>
      <div className="flex-grow overflow-y-auto mb-4 border rounded p-4">
        {messages.map((message, index) => (
          <>
            <div
              key={`message-${index}`}
              className={`mb-4 p-3 rounded ${message.role === "ai" ? "bg-blue-50" : "bg-green-50"}`}
            >
              <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
              {message.content}
            </div>
            {message.role === "user" && currentDocs.length > 0 && index === messages.length - 2 && (
              <div
                key={`docs-${index}`}
                className="mb-4"
              >
                <button
                  onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <span>
                    {expandedSources === index ? "Hide" : "Show"} {currentDocs.length} sources
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${expandedSources === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedSources === index && (
                  <div className="mt-2 p-3 rounded bg-gray-50 font-mono text-sm">
                    {currentDocs.map((doc, i) => (
                      <div
                        key={i}
                        className="mt-4 first:mt-0 pt-4 border-t first:border-t-0 border-gray-200 flex gap-4"
                      >
                        <span className="text-3xl font-bold text-gray-300">{i + 1}</span>
                        <div>{doc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ))}
      </div>

      <div className="flex">
        <Input
          className="flex-grow mr-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          className="mr-2"
        >
          Send
        </Button>
        <Button
          onClick={() => setMessages([])}
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
