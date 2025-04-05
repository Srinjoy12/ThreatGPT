"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCompletionWithContext } from "@/lib/rag/generate/generate-completion";
import { runRagPipeline } from "@/lib/rag/retrieval/run-rag-pipeline";
import { useState, Fragment } from "react";
import { MessageCircle, Send, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

export default function AiChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [currentDocs, setCurrentDocs] = useState<string[]>([]);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setCurrentDocs([]);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">AI Chat</h2>
        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <Fragment key={`message-${index}`}>
            <div
              className={`p-4 rounded-xl max-w-[85%] ${
                message.role === "ai" 
                  ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ml-0" 
                  : "bg-blue-600 dark:bg-blue-500 text-white ml-auto"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            
            {message.role === "user" && currentDocs.length > 0 && index === messages.length - 2 && (
              <div className="mb-4">
                <button
                  onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {expandedSources === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span>
                    {expandedSources === index ? "Hide" : "Show"} {currentDocs.length} sources
                  </span>
                </button>

                {expandedSources === index && (
                  <div className="mt-2 space-y-2">
                    {currentDocs.map((doc, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                            {i + 1}
                          </span>
                          <p>{doc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <Input
          className="flex-grow rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="rounded-xl px-4 h-[42px] bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={() => setMessages([])}
          variant="outline"
          className="rounded-xl px-4 h-[42px] border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}