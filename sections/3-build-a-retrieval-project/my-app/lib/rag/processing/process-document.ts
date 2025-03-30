"use server";

import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { generateEmbeddings } from "../generate/generate-embedding";
import { splitText } from "./split-text";


export async function processDocument(text: string) {

  const chunks = await splitText(text);


  const embeddings = await generateEmbeddings(chunks);


  await db.insert(documentsTable).values(
    chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddings[i]
    }))
  );
}