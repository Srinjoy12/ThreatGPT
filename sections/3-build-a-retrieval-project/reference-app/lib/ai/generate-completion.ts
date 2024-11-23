"use server";

import OpenAI from "openai";

const openai = new OpenAI();

export async function generateCompletion(context: string, input: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: `Answer based on the provided context.
Context:
${context}
`
      },
      { role: "user", content: `${input}` }
    ]
  });

  return completion.choices[0].message.content;
}
