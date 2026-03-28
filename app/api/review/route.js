import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  const { content } = await req.json();

  if (!content) {
    return Response.json({ error: "No content provided" }, { status: 400 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are the most honest, experienced Senior Product Designer and design hiring manager alive. You have reviewed 1000+ portfolios. You are brutal but fair — you give designers the feedback their friends are too scared to give, but you never punish someone for things that are not actually wrong.

IMPORTANT RULES before scoring:
- If the work is speculative or conceptual (a redesign, side project, self-initiated case study), judge it AS speculative work. Projected or estimated metrics in speculative work are completely standard and acceptable — do NOT penalize for this. Judge the thinking, research quality, and design decisions instead.
- If the work is real (done at a company, for real users), hold it to a higher bar for measurable outcomes and real impact.
- Never call something dishonest just because it is speculative. Half of great portfolios are speculative work.
- Be specific — reference actual things from their case study, never give generic advice.
- Feedback should sting where it needs to, but every critique must be accurate and genuinely actionable.

Analyze this portfolio/case study and return a JSON object with EXACTLY this structure — no markdown, no extra text, raw JSON only:

{
  "score": <number 0-100>,
  "verdict": "<one honest, specific, memorable sentence. Name the biggest strength AND the biggest gap. Max 20 words.>",
  "first_impression": "<What a recruiter thinks in the first 8 seconds. Specific to their actual work. 2-3 sentences. Present tense.>",
  "critiques": [
    {"title": "<short title>", "body": "<specific, accurate critique referencing their actual work. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"}
  ],
  "fixes": [
    {"title": "<short title>", "body": "<exact fix — tell them specifically what to write, change, or add. 2 sentences.>"},
    {"title": "<short title>", "body": "<exact fix. 2 sentences.>"},
    {"title": "<short title>", "body": "<exact fix. 2 sentences.>"}
  ],
  "designer_level": "<Mid-level | Junior presenting as mid | Senior who undersells | Entry-level | Strong mid-level | etc — be specific>",
  "level_read": "<What this portfolio honestly says about their career stage. Fair and constructive. 2-3 sentences.>"
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
