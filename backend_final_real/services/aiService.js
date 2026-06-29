import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAISuggestions = async ({ cvText, jobs }) => {
  const prompt = `
Analyze this CV and suggest improvements:
CV: ${cvText}

Top matching job:
${jobs[0]?.title}

Give 5 professional resume improvement tips.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return {
    mode: "openai",
    suggestions: response.choices[0].message.content.split("\n")
  };
};
