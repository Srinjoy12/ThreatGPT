import { CohereClient } from "cohere-ai";
import { config } from "dotenv";
import { cosineDistance, desc, sql } from "drizzle-orm";
import OpenAI from "openai";
import { db } from "./db";
import { factsTable } from "./db/schema/facts-schema";

config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

// Embedding Function
async function generateEmbeddings(texts: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 256,
    input: texts
  });

  return response.data.map((item) => item.embedding);
}

// Upload Function
async function uploadFacts(docs: { content: string; subject: string }[]) {
  const embeddings = await generateEmbeddings(docs.map((doc) => doc.content));

  await db.insert(factsTable).values(
    embeddings.map((embedding, index) => ({
      embedding,
      content: docs[index].content,
      subject: docs[index].subject
    }))
  );
}

// Retrieval Function
async function retrieveDocuments(query: string, limit = 5) {
  const embeddings = await generateEmbeddings([query]);

  const similarity = sql<number>`1 - (${cosineDistance(factsTable.embedding, embeddings[0])})`;

  const documents = await db.query.facts.findMany({
    orderBy: desc(similarity),
    limit: limit
  });

  return documents;
}

// Query Optimization Function
async function getOptimizedQuery(query: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant tasked with optimizing queries for a RAG (Retrieval-Augmented Generation) system. Your goal is to refine the original query to improve the retrieval of relevant information from the knowledge base.

Follow these guidelines to optimize the query:
1. Remove unnecessary words or phrases that don't contribute to the core meaning.
2. Identify and emphasize key concepts or entities.
3. Use more specific or technical terms if appropriate.
4. Ensure the query is clear and concise.
5. Maintain the original intent of the query.

Output only the refined query text, without any additional explanation or formatting, on a single line:`
      },
      { role: "user", content: query }
    ]
  });

  return response.choices[0].message.content;
}

// Document Ranking Function
async function rankDocuments(query: string, documents: { content: string }[], limit = 3) {
  const rerank = await cohere.v2.rerank({
    documents: documents.map((doc) => ({ text: doc.content })),
    query,
    topN: limit,
    model: "rerank-english-v3.0"
  });

  return rerank.results.map((result) => ({
    content: result.document?.text,
    relevanceScore: result.relevanceScore
  }));
}
