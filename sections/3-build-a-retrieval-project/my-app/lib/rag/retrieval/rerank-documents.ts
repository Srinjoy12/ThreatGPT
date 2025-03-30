"use server";

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

// Re-ranks documents using Cohere's reranking model for more accurate relevance scoring
export async function rankDocuments(query: string, documents: { content: string }[], limit = 3) {
  
  if (!documents || documents.length === 0) {
    return [];
  }

  try {
    
    const rerank = await cohere.v2.rerank({
      documents: documents.map(doc => doc.content), // Map to array of strings
      query,
      topN: limit, 
      model: "rerank-english-v3.0" // Latest English reranking model
    });

    
    return rerank.results.map((result) => ({
      // name: documents[result.index].name,
      content: documents[result.index].content,
      relevanceScore: result.relevanceScore // Score indicating relevance
    }));
  } catch (error) {
    console.error("Error reranking documents:", error);
    
    return documents.slice(0, limit);
  }
}

