import { openai } from "./0-api-clients";
import { processQuery } from "./8-all-together";

async function main() {
  // const query = "I want to learn about animal sleep patterns";
  // const query = "Tell me about giraffes";
  const query = "What do African animals eat?";
  const relevantDocs = await processQuery(query);

  const context = relevantDocs.map((doc) => doc.content).join("\n\n");

  const BASIC_PROMPT = `You are a helpful assistant that answers questions about animals backed by facts. Use the following context to answer questions:\n\n` + context;

  const ADVANCED_PROMPT = `You are a helpful assistant that answers questions about animals based on factual information. Your task is to provide accurate and informative responses to questions about animals using the following context:

<animal_facts>
${context}
</animal_facts>

When answering questions, follow these guidelines:

1. Carefully read the provided animal facts and use this information as the basis for your answers.

2. If the question can be answered using the information in the context, provide a clear and concise response based solely on those facts.

3. If the question cannot be fully answered using the provided context, state that you don't have enough information to provide a complete answer, but offer any relevant facts from the context that may be partially related to the question.

4. Do not make up or infer information that is not explicitly stated in the provided context.

5. If the question is completely unrelated to the information in the context, politely explain that you don't have information to answer that specific question.

6. Maintain a friendly and educational tone in your responses, suitable for all ages.

7. If appropriate, encourage curiosity by suggesting related topics the questioner might find interesting based on their initial question.

Remember to base your answer solely on the provided animal facts context and follow the guidelines outlined above.`;

  const PROMPT_TO_USE = ADVANCED_PROMPT;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: PROMPT_TO_USE },
      { role: "user", content: query }
    ],
    stream: true
  });

  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();
