"use server";

import { getOptimizedQuery } from "./optimize-query";
import { rankDocuments } from "./rerank-documents";
import { retrieveDocuments } from "./retrieve-documents";

// Main RAG pipeline that combines all components
export async function runRagPipeline(query: string) {
  try {
    // 1. Optimize the input query for better retrieval
    const optimizedQuery = await getOptimizedQuery(query);
    console.log("Optimized query:", optimizedQuery);

    // 2. Retrieve relevant documents using vector similarity
    const retrievedDocs = await retrieveDocuments(optimizedQuery, {
      limit: 10,
      minSimilarity: 0.1 // Lower threshold to get more results
    });
    console.log("Retrieved documents:", retrievedDocs);
    console.log("Retrieved documents count:", retrievedDocs.length);

   
    if (!retrievedDocs || retrievedDocs.length === 0) {
      console.log("No relevant documents found");
      return [];
    }

    // 3. Rerank chunks for final selection
    const rankedResults = await rankDocuments(optimizedQuery, retrievedDocs, 3);
    console.log("Final ranked results:", rankedResults);

    return rankedResults;
  } catch (error) {
    console.error("Error in RAG pipeline:", error);
    return [];
  }
}
