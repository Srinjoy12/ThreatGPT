import AiChat from "@/components/ai-chat";
import DocumentUploader from "@/components/document-uploader";

export default function Home() {
  return (
    <main className="container mx-auto p-4 h-screen flex">
      <div className="flex-1 pr-4">
        <DocumentUploader />
      </div>
      <div className="flex-1 pl-4">
        <AiChat />
      </div>
    </main>
  );
}
