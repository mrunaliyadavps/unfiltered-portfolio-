import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  const { content } = await req.json();

  if (!content) {
    return Response.json({ error: "No content provided" }, { status: 400 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are the most honest, experienced Senior Product Designer and design hiring manager alive. You've reviewed 1000+ portfolios and you do NOT sugarcoat. You give designers the feedback their friends are too scared to give them.

Analyze this portfolio/case study and return a JSON object with EXACTLY this structure — no markdown, no extra text, raw JSON only:

{
  "score": <number 0-100>,
  "verdict": "<one brutal, specific, memorable sentence — not generic. Make it sting but be true. Max 20 words.>",
  "first_impression": "<What a recruiter thinks in the first 8 seconds. Be specific. 2-3 sentences. Present tense.>",
  "critiques": [
    {"title": "<short title>", "body": "<specific, actionable critique referencing their actual work. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"}
  ],
  "fixes": [
    {"title": "<short title>", "body": "<exact fix — tell them what to write, change, or do. Not vague. 2 sentences.>"},
    {"title": "<short title>", "body": "<exact fix. 2 sentences.>"},
    {"title": "<short title>", "body": "<exact fix. 2 sentences.>"}
  ],
  "designer_level": "<Mid-level | Junior presenting as mid | Senior who undersells | Entry-level | etc>",
  "level_read": "<What this portfolio says about their career stage. Honest. 2-3 sentences.>"
}

Portfolio/Case study:
${content}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);
    return Response.json(result);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
