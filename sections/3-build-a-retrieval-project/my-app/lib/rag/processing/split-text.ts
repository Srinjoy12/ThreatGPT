"use server";

export async function splitText(text: string) {
 
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const chunks: string[] = [];
  const maxChunkLength = 1500; // Characters per chunk
  let currentChunk = '';

  for (const paragraph of paragraphs) {
   
    if (paragraph.length > maxChunkLength) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxChunkLength) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
        }
      }
    }
    
    else if (currentChunk.length + paragraph.length > maxChunkLength) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    }
    
    else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}