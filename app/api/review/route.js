import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  const { content, seniority, industry } = await req.json();

  if (!content) {
    return Response.json({ error: "No content provided" }, { status: 400 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `You are the most honest, experienced Senior Product Designer and design hiring manager alive. You have reviewed 1000+ portfolios. You are brutal but fair — you give designers the feedback their friends are too scared to give, but you never punish someone for things that are not actually wrong.

The designer is targeting: ${seniority || "mid-level"} roles in the ${industry || "tech"} industry. Calibrate your scoring and feedback to this context.

IMPORTANT RULES:
- Speculative/conceptual work with projected metrics is standard and acceptable — never penalize for this
- Be specific — reference actual things from their case study, never give generic advice
- Never use scores that are multiples of 5 or 10 — be precise (e.g. 67, 73, 81, 88)
- hiring_confidence must be exactly one of: "WOULD SHORTLIST", "MAYBE", "WOULD PASS"
- For rewrite: find the single weakest, most generic sentence in their case study and rewrite it
- green_flags must highlight 2 things they are genuinely doing well — be specific
- red_flags must be 3 specific, accurate critiques referencing their actual work
- today_action must be ONE specific thing they can do in the next hour to improve this
- All sub_scores are out of 10

Return a JSON object with EXACTLY this structure — no markdown, no extra text, raw JSON only:

{
  "score": <number 0-100, never a multiple of 5 or 10>,
  "verdict": "<one italic-worthy sentence. Name the biggest strength AND gap. Max 20 words.>",
  "summary": "<2-3 sentences expanding on the verdict. Specific to their work. Present tense.>",
  "hiring_confidence": "<WOULD SHORTLIST | MAYBE | WOULD PASS>",
  "sub_scores": {
    "visual_craft": <number out of 10, never multiple of 5>,
    "research_depth": <number out of 10, never multiple of 5>,
    "storytelling": <number out of 10, never multiple of 5>,
    "impact": <number out of 10, never multiple of 5>
  },
  "green_flags": [
    {"title": "<short title>", "body": "<specific thing they are doing well. 1-2 sentences.>"},
    {"title": "<short title>", "body": "<specific thing they are doing well. 1-2 sentences.>"}
  ],
  "red_flags": [
    {"title": "<short title>", "body": "<specific critique referencing their actual work. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"},
    {"title": "<short title>", "body": "<specific critique. 2 sentences.>"}
  ],
  "rewrite": {
    "original": "<exact weakest sentence copied from their case study>",
    "improved": "<your rewrite — specific, impact-driven, senior-level>"
  },
  "today_action": "<ONE specific thing they can do in the next hour. Start with a verb. Be exact, not vague.>",
  "today_action_label": "<3-4 word label for the action>"
}

Portfolio/Case study:
${content}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
