"use server";

import OpenAI from "openai";

const openai = new OpenAI();


export async function generateEmbeddings(texts: string[]) {
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", 
    dimensions: 256, // Output vector size of 256 dimensions
    input: texts // Array of text strings to embed
  });
  console.log(response);

  
  return response.data.map((item) => item.embedding);
}