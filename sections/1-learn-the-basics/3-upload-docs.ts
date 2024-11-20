import { config } from "dotenv";
import OpenAI from "openai";
import { db } from "./db";
import { documentsTable } from "./db/schema/documents-schema";

config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MOCK_DOCS = [
  { content: "A group of flamingos is called a 'flamboyance'.", name: "Fun Fact 1" },
  { content: "Octopuses have three hearts.", name: "Fun Fact 2" },
  { content: "Butterflies taste with their feet.", name: "Fun Fact 3" },
  { content: "A snail can sleep for three years.", name: "Fun Fact 4" },
  { content: "Elephants are the only animals that can't jump.", name: "Fun Fact 5" },
  { content: "A rhinoceros' horn is made of hair.", name: "Fun Fact 6" },
  { content: "Slugs have four noses.", name: "Fun Fact 7" },
  { content: "A cow gives nearly 200,000 glasses of milk in a lifetime.", name: "Fun Fact 8" },
  { content: "Bats are the only mammals that can fly.", name: "Fun Fact 9" },
  { content: "Koalas sleep up to 22 hours a day.", name: "Fun Fact 10" }
];

export async function uploadDocuments(docs: { content: string; name: string }[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 256,
    input: docs.map((doc) => doc.content)
  });

  console.log(response.data);
  console.log(response.data.length);

  await db.insert(documentsTable).values(
    response.data.map((item, index) => ({
      embedding: item.embedding,
      content: docs[index].content,
      name: docs[index].name
    }))
  );

  return response.data.map((item) => item.embedding);
}

uploadDocuments(MOCK_DOCS);
