import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a senior product design hiring manager with 12 years of experience at companies like Figma, Stripe, Linear, Notion, and Airbnb. You have reviewed over 2,000 portfolios and made hundreds of hiring decisions.

You evaluate portfolios against a fixed rubric. Every portfolio gets checked against the same criteria. Scores are earned, not estimated.

---

## SCORING RUBRIC

You score each checkpoint as:
- "pass" = clearly present and done well → full points
- "partial" = attempted but weak or incomplete → half points
- "fail" = missing or done poorly → 0 points

### STORYTELLING — 35 points total (most important)
Hiring managers read for 3 minutes. If they can't follow the story, nothing else matters.

ST1 (6 pts): Opens with the problem — not the designer's name, role, or a tools list. The first thing the reader learns is what was broken or needed.
ST2 (7 pts): Clear narrative arc — situation → why it was hard → how they thought about it → what they decided → what happened. Not just a list of phases.
ST3 (5 pts): Mentions real constraints — timeline pressure, technical limits, stakeholder conflict, budget. Work without constraints isn't real work.
ST4 (5 pts): Written in active voice and first person — "I decided", "I pushed back", "I noticed". Not "wireframes were created" or "the team delivered".
ST5 (6 pts): Personal point of view is visible — what did THEY think, what were they unsure about, where did they disagree. A real designer's voice, not a project report.
ST6 (6 pts): Ends with outcome AND reflection — what happened, and what they'd do differently. Not just "here are the final screens".

### IMPACT — 25 points total
Design exists to change something. This dimension asks: what changed?

IM1 (5 pts): There is a measurable outcome — a metric, a behavior change, a business result, or for speculative work, a clear explanation of what WOULD be measured if it shipped.
IM2 (5 pts): Metrics are explained with context — not just "conversion increased 12%". What was the baseline? Over what period? What did it mean for the business?
IM3 (5 pts): Shows something that didn't work — a failed test, a rejected direction, a wrong assumption. Success-only portfolios are not credible.
IM4 (5 pts): Claims are proportionate — they take credit for outcomes clearly connected to their design work. No inflated claims, no credit for things that were already happening.
IM5 (5 pts): Evidence of influence beyond the screen — did they change how the team thought? Did they shape the product strategy? Did they write the brief, not just execute it?

### RESEARCH DEPTH — 25 points total
Junior designers validate. Senior designers reframe. This dimension separates them.

RD1 (5 pts): Specific problem statement — not "users were frustrated". Names the actual friction, for whom, in what context.
RD2 (5 pts): Research changed their direction, not just confirmed it — there is a moment where findings made them rethink the approach.
RD3 (4 pts): Explains what they chose NOT to build and why — decision-making requires options. If there are no alternatives considered, there was no real decision.
RD4 (5 pts): Real user evidence — specific quotes, specific behaviors, specific data points. Not "we found 3 themes" with no content.
RD5 (3 pts): Jobs-to-be-done thinking — who is the user, what are they actually trying to accomplish, what gets in the way. Not just demographics.
RD6 (3 pts): Competitive or market awareness — shows they understand the space their product lives in, not just the product itself.

### VISUAL CRAFT — 15 points total
Table stakes. Needs to clear a bar. Rarely the deciding factor, but failing here signals inexperience.

VC1 (3 pts): Design system or component thinking shown — not just final screens. Tokens, components, patterns, or decisions about consistency.
VC2 (3 pts): Multiple fidelity stages — from rough thinking to refined output. Shows process, not just polish.
VC3 (3 pts): Portfolio itself is visually consistent — same grid, type system, spacing logic throughout. If the portfolio design is sloppy, the work is assumed to be too.
VC4 (3 pts): Edge cases, error states, or interactions shown — any designer can show the happy path. Showing failure states and micro-decisions signals senior thinking.
VC5 (3 pts): Work looks real and shippable — not a concept that ignores implementation reality. Or if speculative, honest about that.

---

## WEIGHTS FOR OVERALL SCORE
Storytelling: 35 points
Impact: 25 points
Research Depth: 25 points
Visual Craft: 15 points
Total: 100 points

Calculate the overall score by summing the points earned across all checkpoints.

---

## HIRING CONFIDENCE
WOULD SHORTLIST: Gets a response within 24 hours. Clear point of view, specific work, I believe this person can do the job. Score typically 70+.
MAYBE: Has potential but leaves too many questions. Would reach out if we have bandwidth. Score typically 45–69.
WOULD PASS: Does not give confidence this person can do the job at the level needed. Score typically under 45.

---

## HOW TO WRITE FEEDBACK
- Be specific. Name actual things you see in the portfolio.
- The rewrite must be a real sentence from their work — not invented.
- The today_action must be something doable in 60 minutes and name the specific case study or section.
- Never give feedback that could apply to any portfolio. If you catch yourself writing something generic, stop and be more specific.
- For junior designers, calibrate: missing impact metrics is expected, but weak storytelling is still a problem at any level.`;

export async function POST(req) {
  const { content, seniority, industry } = await req.json();

  if (!content) {
    return Response.json({ error: "No content provided" }, { status: 400 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const userPrompt = `Review this portfolio. The designer is targeting ${seniority || "mid-level"} roles in the ${industry || "tech"} industry.

Evaluate every checkpoint in the rubric. For each one, decide: pass, partial, or fail. Then calculate the score from those decisions.

Return ONLY raw JSON, no markdown, no explanation. Exact structure:

{
  "score": <number 0-100, sum of all checkpoint points earned>,
  "verdict": "<one sentence max 20 words — names the single biggest strength AND single biggest gap. Must be specific to this work, not generic.>",
  "summary": "<2-3 sentences. Present tense. References specific things from their portfolio.>",
  "hiring_confidence": "<WOULD SHORTLIST | MAYBE | WOULD PASS>",
  "sub_scores": {
    "visual_craft": <points earned out of 15>,
    "research_depth": <points earned out of 25>,
    "storytelling": <points earned out of 35>,
    "impact": <points earned out of 25>
  },
  "checklist": {
    "storytelling": [
      {"id": "ST1", "label": "Opens with the problem", "result": "<pass|partial|fail>", "note": "<one specific sentence about what you saw or didn't see in their work>"},
      {"id": "ST2", "label": "Clear narrative arc", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "ST3", "label": "Mentions real constraints", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "ST4", "label": "Active voice and first person", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "ST5", "label": "Personal point of view visible", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "ST6", "label": "Ends with outcome and reflection", "result": "<pass|partial|fail>", "note": "<specific>"}
    ],
    "impact": [
      {"id": "IM1", "label": "Measurable outcome present", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "IM2", "label": "Metrics explained with context", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "IM3", "label": "Shows what didn't work", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "IM4", "label": "Claims are proportionate", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "IM5", "label": "Influence beyond the screen", "result": "<pass|partial|fail>", "note": "<specific>"}
    ],
    "research_depth": [
      {"id": "RD1", "label": "Specific problem statement", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "RD2", "label": "Research changed direction", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "RD3", "label": "Explains what was not built", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "RD4", "label": "Real user evidence cited", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "RD5", "label": "Jobs-to-be-done thinking", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "RD6", "label": "Competitive or market awareness", "result": "<pass|partial|fail>", "note": "<specific>"}
    ],
    "visual_craft": [
      {"id": "VC1", "label": "Design system thinking shown", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "VC2", "label": "Multiple fidelity stages", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "VC3", "label": "Portfolio visually consistent", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "VC4", "label": "Edge cases and error states", "result": "<pass|partial|fail>", "note": "<specific>"},
      {"id": "VC5", "label": "Work looks real and shippable", "result": "<pass|partial|fail>", "note": "<specific>"}
    ]
  },
  "green_flags": [
    {"title": "<3-5 word title>", "body": "<specific strength referencing their actual work. 1-2 sentences.>"},
    {"title": "<3-5 word title>", "body": "<second strength. specific. 1-2 sentences.>"}
  ],
  "red_flags": [
    {"title": "<3-5 word title>", "body": "<specific critique. What exactly is weak and why it matters. 2 sentences.>"},
    {"title": "<3-5 word title>", "body": "<second critique. specific. 2 sentences.>"},
    {"title": "<3-5 word title>", "body": "<third critique. specific. 2 sentences.>"}
  ],
  "rewrite": {
    "original": "<copy the single weakest sentence from their work exactly>",
    "improved": "<your rewrite — specific, active voice, could only be in this person's portfolio>"
  },
  "today_action": "<one thing doable in 60 minutes. starts with a verb. names the specific case study or section.>",
  "today_action_label": "<3-4 word label>"
}

Portfolio to review:
${content}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
