import { config } from "dotenv";
import OpenAI from "openai";

config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbeddings(texts: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 256,
    input: texts
  });

  console.log(response.data);
  console.log(response.data.length);

  return response.data.map((item) => item.embedding);
}

generateEmbeddings(["Hello, world!", "Goodbye, world!", "My name is Mckay"]);
