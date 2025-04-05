"use server";

import { supabase } from "@/db/supabase";
import { generateEmbeddings } from "../generate/generate-embedding";
import { splitText } from "./split-text";
import { retryWithBackoff } from "@/lib/utils/retry";

const CHUNK_SIZE = 10; // Number of documents to insert at once

export async function processDocument(text: string) {
  try {
    console.log("Starting document processing...");
    const chunks = await splitText(text);
    console.log(`Split text into ${chunks.length} chunks`);

    const embeddings = await generateEmbeddings(chunks);
    console.log("Generated embeddings for all chunks");

    // Process chunks in batches
    for (let i = 0; i < chunks.length; i += CHUNK_SIZE) {
      const batch = chunks.slice(i, i + CHUNK_SIZE);
      const batchEmbeddings = embeddings.slice(i, i + CHUNK_SIZE);

      console.log(`Processing batch ${i / CHUNK_SIZE + 1} of ${Math.ceil(chunks.length / CHUNK_SIZE)}`);

      await retryWithBackoff(async () => {
        const { error } = await supabase
          .from('documents')
          .insert(
            batch.map((chunk, index) => ({
              content: chunk,
              embedding: batchEmbeddings[index]
            }))
          );

        if (error) {
          console.error(`Error inserting batch ${i / CHUNK_SIZE + 1}:`, error);
          throw error;
        }

        console.log(`Successfully inserted batch ${i / CHUNK_SIZE + 1}`);
      });
    }

    console.log("Document processing completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}