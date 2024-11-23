import { createDataAction } from "@/actions/db/data-actions";
import { generateEmbeddings } from "../../ai/generate-embeddings";
import { splitText } from "./split-text";

export async function processData(text: string) {
  const chunks = await splitText(text);

  const embeddings = await generateEmbeddings(chunks);

  await createDataAction(
    chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddings[i]
    }))
  );
}
