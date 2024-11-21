export async function splitText(data: { content: string; name: string }[]) {
  // Array to store the text chunks
  const chunks: { content: string; name: string }[] = [];
  // Number of words per chunk
  const CHUNK_SIZE = 500;

  // Iterate through each document in the input array
  for (const { content, name } of data) {
    // Split content into array of words
    const words = content.split(/\s+/);

    // Create chunks of CHUNK_SIZE words
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      const chunkWords = words.slice(i, i + CHUNK_SIZE);
      chunks.push({
        content: chunkWords.join(" "),
        name
      });
    }
  }

  return chunks;
}

// UNCOMMENT TO TEST, THEN COMMENT AGAIN
// async function main() {
//   const chunks = await splitText([{ content: ELEPHANT_WIKI, name: "Elephants" }]);
//   console.log(chunks);
//   console.log(chunks.length);
// }

// main();
