"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { processDocument } from "@/lib/rag/processing/process-document";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function DocumentUploader() {
  const [document, setDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!document.trim()) return;
    
    try {
      setIsLoading(true);
      await processDocument(document);
      setDocument("");
    } catch (error) {
      console.error("Error processing document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Document Uploader</h2>
        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="flex-grow flex flex-col space-y-4">
        <Textarea
          className="flex-grow min-h-[300px] resize-none rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
          placeholder="Enter your document text here..."
          value={document}
          onChange={(e) => setDocument(e.target.value)}
        />
        <Button 
          onClick={handleUpload}
          disabled={isLoading || !document.trim()}
          className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 transition-all shadow-md hover:shadow-lg rounded-xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </div>
          ) : (
            'Upload Document'
          )}
        </Button>
      </div>
    </div>
  );
}