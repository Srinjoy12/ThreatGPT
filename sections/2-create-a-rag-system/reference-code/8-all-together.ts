import { retrieveData } from "./3-retrieve-data";
import { getOptimizedQuery } from "./4-optimize-query";
import { rankDocuments } from "./5-rerank-documents";
import { extractName } from "./6-filter-metadata";

// Main RAG pipeline that combines all components
export async function processQuery(query: string) {
  // 1. Optimize the input query for better retrieval
  const optimizedQuery = await getOptimizedQuery(query);
  console.log("Optimized query:", optimizedQuery);

  // 2. Extract entity name for metadata filtering
  const entityName = await extractName(query);
  console.log("Extracted entity:", entityName);

  // 3. Retrieve relevant documents using vector similarity
  const retrievedDocs = await retrieveData(optimizedQuery, {
    name: entityName,
    limit: 10,
    minSimilarity: 0.3
  });
  console.log("Retrieved documents:", retrievedDocs.length);

  // 4. Rerank chunks for final selection
  const rankedResults = await rankDocuments(optimizedQuery, retrievedDocs, 3);
  console.log("Final ranked results:", rankedResults);

  return rankedResults;
}

// UNCOMMENT TO TEST, THEN COMMENT AGAIN
// async function main() {
//   const query = "I want to learn about animal sleep patterns";
//   await processQuery(query);
// }

// main();
