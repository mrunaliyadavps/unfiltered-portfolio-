"use client";

const DIMENSIONS = [
  { key: "storytelling",   label: "Storytelling",   max: 35, weight: "35 pts" },
  { key: "impact",         label: "Impact",          max: 25, weight: "25 pts" },
  { key: "research_depth", label: "Research Depth",  max: 25, weight: "25 pts" },
  { key: "visual_craft",   label: "Visual Craft",    max: 15, weight: "15 pts" },
];

const RESULT_CONFIG = {
  pass:    { color: "#2D6A4F", bg: "rgba(45,106,79,0.08)",   dot: "#2D6A4F", label: "Pass"    },
  partial: { color: "#B07D2E", bg: "rgba(176,125,46,0.08)",  dot: "#B07D2E", label: "Partial" },
  fail:    { color: "#C0392B", bg: "rgba(192,57,43,0.08)",   dot: "#C0392B", label: "Fail"    },
};

const HIRING_CONFIG = {
  "WOULD SHORTLIST": { color: "#2D6A4F", bg: "rgba(45,106,79,0.08)"  },
  "MAYBE":           { color: "#B07D2E", bg: "rgba(176,125,46,0.08)" },
  "WOULD PASS":      { color: "#C0392B", bg: "rgba(192,57,43,0.08)"  },
};

function todayDate() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function ScoreBar({ value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ flex: 1, height: "4px", background: "var(--blue-dim)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--blue)", borderRadius: "2px", transition: "width 1s ease-out" }} />
    </div>
  );
}

function ChecklistItem({ item }) {
  const config = RESULT_CONFIG[item.result] ?? RESULT_CONFIG.fail;
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%", background: config.bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: config.dot }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "3px" }}>
          <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {item.label}
          </span>
          <span style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.5px", color: config.color, textTransform: "uppercase", flexShrink: 0, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {config.label}
          </span>
        </div>
        {item.note && (
          <p style={{ fontSize: "12px", color: "var(--ink3)", lineHeight: "1.5", margin: 0, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {item.note}
          </p>
        )}
      </div>
    </div>
  );
}

function DimensionSection({ dimension, subScores, checklist }) {
  const score = subScores?.[dimension.key] ?? 0;
  const items = checklist?.[dimension.key] ?? [];
  const passCount = items.filter(i => i.result === "pass").length;
  const partialCount = items.filter(i => i.result === "partial").length;

  return (
    <div style={{ padding: "24px 28px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "14px" }}>
      {/* Dimension header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {dimension.label}
            </span>
            <span style={{ fontSize: "13px", color: "var(--ink)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              <strong>{score}</strong>
              <span style={{ color: "var(--ink4)" }}> / {dimension.max}</span>
            </span>
          </div>
          <ScoreBar value={score} max={dimension.max} />
        </div>
      </div>

      {/* Pass/partial/fail summary */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {[
          { label: `${passCount} passed`,    color: "#2D6A4F", bg: "rgba(45,106,79,0.08)"  },
          { label: `${partialCount} partial`, color: "#B07D2E", bg: "rgba(176,125,46,0.08)" },
          { label: `${items.length - passCount - partialCount} failed`, color: "#C0392B", bg: "rgba(192,57,43,0.08)" },
        ].map(tag => (
          <span key={tag.label} style={{
            fontSize: "11px", fontWeight: "600", color: tag.color, background: tag.bg,
            padding: "3px 8px", borderRadius: "999px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}>
            {tag.label}
          </span>
        ))}
      </div>

      {/* Checklist items */}
      <div>
        {items.map(item => <ChecklistItem key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export default function ScoreCard({ result }) {
  if (!result) return null;

  const hiringConfig = HIRING_CONFIG[result.hiring_confidence] ?? HIRING_CONFIG["MAYBE"];

  return (
    <section className="fade-up" style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* Report header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", padding: "28px 0 20px" }}>
        <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Unfiltered Report
        </span>
        <span style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          {todayDate()}
        </span>
      </div>

      {/* Verdict card */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "28px", padding: "28px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "16px", marginBottom: "16px", alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "13px", color: "var(--ink4)", marginBottom: "10px" }}>
            The Verdict.
          </div>
          <blockquote style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: "400", color: "var(--ink)", lineHeight: "1.35", fontStyle: "italic", marginBottom: "14px", letterSpacing: "-0.2px" }}>
            &ldquo;{result.verdict}&rdquo;
          </blockquote>
          <p style={{ fontSize: "14px", color: "var(--ink2)", lineHeight: "1.65", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {result.summary}
          </p>
        </div>

        <div style={{ textAlign: "center", minWidth: "80px" }}>
          <div style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "52px", fontWeight: "300", lineHeight: "1", color: "var(--ink)", letterSpacing: "-2px" }}>
            {result.score}
          </div>
          <div style={{ fontSize: "11px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>/ 100</div>
          <div style={{ display: "inline-block", marginTop: "10px", padding: "4px 8px", background: hiringConfig.bg, borderRadius: "999px", fontSize: "9px", fontWeight: "700", letterSpacing: "0.5px", color: hiringConfig.color, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", textAlign: "center", lineHeight: "1.4" }}>
            {result.hiring_confidence}
          </div>
        </div>
      </div>

      {/* Checklist by dimension */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        {DIMENSIONS.map(dim => (
          <DimensionSection
            key={dim.key}
            dimension={dim}
            subScores={result.sub_scores}
            checklist={result.checklist}
          />
        ))}
      </div>

      {/* Green + Red flags */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        {[
          { label: "Green flags", items: result.green_flags ?? [], color: "#2D6A4F", dot: "#2D6A4F" },
          { label: "Red flags",   items: result.red_flags   ?? [], color: "#C0392B", dot: "#C0392B" },
        ].map(col => (
          <div key={col.label} style={{ padding: "22px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: col.dot }} />
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: col.color, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {col.label}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {col.items.map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)", marginBottom: "4px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--ink3)", lineHeight: "1.55", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rewrite */}
      {result.rewrite && (
        <div style={{ padding: "24px 28px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "14px", marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontWeight: "600", marginBottom: "20px" }}>
            Rewrite this sentence
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              { label: "Your original",          color: "#C0392B", text: result.rewrite.original  },
              { label: "Unfiltered suggestion",  color: "#2D6A4F", text: result.rewrite.improved   },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: col.color, fontWeight: "600", marginBottom: "10px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  {col.label}
                </div>
                <p style={{ fontSize: "13px", fontStyle: "italic", color: col.label === "Your original" ? "var(--ink3)" : "var(--ink)", lineHeight: "1.6", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  &ldquo;{col.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today action */}
      {result.today_action && (
        <div style={{ padding: "28px", background: "var(--blue)", borderRadius: "14px", marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(26,26,26,0.5)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontWeight: "600", marginBottom: "8px" }}>
            One thing to do today
          </div>
          <p style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "clamp(16px, 2vw, 19px)", fontWeight: "400", color: "#1A1A1A", lineHeight: "1.5" }}>
            {result.today_action}
          </p>
          {result.today_action_label && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "rgba(26,26,26,0.55)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {result.today_action_label} →
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid var(--border-soft)" }}>
        <span style={{ fontSize: "12px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          Unfiltered — AI Portfolio Review
        </span>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Unfiltered — AI Portfolio Review", text: `I scored ${result.score}/100 on Unfiltered — brutally honest portfolio feedback for designers.` });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "999px", background: "transparent", cursor: "pointer", fontSize: "12px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", color: "var(--ink2)" }}
        >
          Share score
        </button>
      </div>
    </section>
  );
}
