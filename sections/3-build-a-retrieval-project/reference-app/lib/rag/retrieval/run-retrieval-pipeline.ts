"use server";

import { getOptimizedQuery } from "./optimize-query";
import { rankDocuments } from "./rerank-documents";
import { retrieveData } from "./retrieve-data";

// Main RAG pipeline that combines all components
export async function runRetrievalPipeline(query: string) {
  // 1. Optimize the input query for better retrieval
  const optimizedQuery = await getOptimizedQuery(query);
  console.log("Optimized query:", optimizedQuery);

  //   // 2. Extract entity name for metadata filtering
  //   const entityName = await filterMetadata(query);
  //   console.log("Extracted entity:", entityName);

  // 3. Retrieve relevant documents using vector similarity
  const retrievedDocs = await retrieveData(optimizedQuery, {
    limit: 10
  });
  console.log("Retrieved documents:", retrievedDocs);
  console.log("Retrieved documents count:", retrievedDocs.length);

  // 4. Rerank chunks for final selection
  const rankedResults = await rankDocuments(optimizedQuery, retrievedDocs, 3);
  console.log("Final ranked results:", rankedResults);

  return rankedResults;
}
