import { openai } from "./0-api-clients";

// Takes an array of text strings and returns their vector embeddings
export async function generateEmbeddings(texts: string[]) {
  // Generate embeddings using OpenAI's text-embedding-3-small model
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // Use small model for better cost/performance ratio
    dimensions: 256, // Output vector size of 256 dimensions
    input: texts // Array of text strings to embed
  });

  // Extract just the embedding vectors from the response
  return response.data.map((item) => item.embedding);
}

// UNCOMMENT TO TEST, THEN COMMENT AGAIN
// async function main() {
//   const embeddings = await generateEmbeddings(["Hello, world!"]);
//   console.log(embeddings);
// }

// main();
