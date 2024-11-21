import { CohereClient } from "cohere-ai";
import { config } from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env.local file
config({ path: ".env.local" });

// Initialize OpenAI client with API key
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Cohere client with API token
export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});
