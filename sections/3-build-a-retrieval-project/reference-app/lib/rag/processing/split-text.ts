"use server";

import { get_encoding } from "tiktoken";

export async function splitText(text: string) {
  const chunks: string[] = [];
  const CHUNK_SIZE = 500;
  const encoding = get_encoding("cl100k_base");

  try {
    const tokens = encoding.encode(text);

    for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
      const chunkTokens = tokens.slice(i, i + CHUNK_SIZE);
      const chunk = new TextDecoder().decode(encoding.decode(chunkTokens));
      chunks.push(chunk);
    }

    return chunks;
  } finally {
    encoding.free();
  }
}
