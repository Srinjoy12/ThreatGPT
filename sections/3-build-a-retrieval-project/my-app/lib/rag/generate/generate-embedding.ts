"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 3, // Retry failed requests up to 3 times
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
    
    return retryWithBackoff(fn, retries - 1);
  }
}

export async function generateEmbeddings(texts: string[]) {
  try {
    const response = await retryWithBackoff(async () => {
      const result = await openai.embeddings.create({
        model: "text-embedding-3-small",
        dimensions: 256,
        input: texts
      });
      return result;
    });

    // Process the response in smaller chunks
    const embeddings = [];
    for (const item of response.data) {
      embeddings.push(item.embedding);
    }

    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
    throw new Error('Failed to generate embeddings: Unknown error');
  }
}