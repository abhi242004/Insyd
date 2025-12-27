import "dotenv/config";

export async function analyzeLead(message) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
You are an AI sales assistant.
Return ONLY valid JSON with:
intent, urgency, lead_score, recommended_action, reasoning

Inquiry:
"${message}"
          `,
        },
      ],
      temperature: 0.2,
    }),
  });

  const data = await response.json();
  const text = data.choices[0].message.content;

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
}