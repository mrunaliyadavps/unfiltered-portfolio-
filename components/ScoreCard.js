"use client";

const DIMENSION_LABELS = {
  visual_craft: "Visual Craft",
  research_depth: "Research Depth",
  storytelling: "Storytelling",
  impact: "Impact",
};

function ScoreBar({ value, max = 10 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="score-bar-track" style={{ flex: 1 }}>
      <div className="score-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function todayDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ScoreCard({ result }) {
  if (!result) return null;

  const hiringColor =
    result.hiring_confidence === "WOULD SHORTLIST"
      ? "#2D6A4F"
      : result.hiring_confidence === "MAYBE"
      ? "#B07D2E"
      : "#C0392B";

  const hiringBg =
    result.hiring_confidence === "WOULD SHORTLIST"
      ? "rgba(45,106,79,0.08)"
      : result.hiring_confidence === "MAYBE"
      ? "rgba(176,125,46,0.08)"
      : "rgba(192,57,43,0.08)";

  return (
    <section
      className="fade-up"
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "0 24px 80px",
      }}
    >
      {/* Report header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(26,26,26,0.10)",
          paddingTop: "32px",
          paddingBottom: "24px",
          marginBottom: "0",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#A0A0A0",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Unfiltered Report
        </div>
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#A0A0A0",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          {todayDate()}
        </div>
      </div>

      {/* Score + verdict */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "32px",
          padding: "32px",
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(26,26,26,0.08)",
          borderRadius: "16px",
          marginBottom: "20px",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(16px, 2vw, 18px)",
              fontWeight: "400",
              color: "#6B6B6B",
              marginBottom: "12px",
            }}
          >
            The Verdict.
          </div>
          <blockquote
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(20px, 2.5vw, 26px)",
              fontWeight: "400",
              color: "#1A1A1A",
              lineHeight: "1.35",
              fontStyle: "italic",
              marginBottom: "16px",
              letterSpacing: "-0.2px",
            }}
          >
            &ldquo;{result.verdict}&rdquo;
          </blockquote>
          <p
            style={{
              fontSize: "14px",
              color: "#3A3A3A",
              lineHeight: "1.65",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            {result.summary}
          </p>
        </div>

        {/* Score circle */}
        <div style={{ textAlign: "center", minWidth: "90px" }}>
          <div
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "54px",
              fontWeight: "300",
              lineHeight: "1",
              color: "#1A1A1A",
              letterSpacing: "-2px",
            }}
          >
            {result.score}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#A0A0A0",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            / 100
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "4px 10px",
              background: hiringBg,
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              color: hiringColor,
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              textAlign: "center",
            }}
          >
            {result.hiring_confidence}
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      {result.sub_scores && (
        <div
          style={{
            padding: "24px 28px",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: "14px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#A0A0A0",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            Dimension Scores
          </div>
          {Object.entries(result.sub_scores).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "130px",
                  fontSize: "13px",
                  color: "#3A3A3A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  flexShrink: 0,
                }}
              >
                {DIMENSION_LABELS[key] ?? key}
              </div>
              <ScoreBar value={val} />
              <div
                style={{
                  width: "28px",
                  textAlign: "right",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1A1A1A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  flexShrink: 0,
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Green + Red flags */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Green flags */}
        <div
          style={{
            padding: "22px",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2D6A4F" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#2D6A4F",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Green flags
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {(result.green_flags ?? []).map((f, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1A1A1A",
                    marginBottom: "4px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6B6B6B",
                    lineHeight: "1.55",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Red flags */}
        <div
          style={{
            padding: "22px",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C0392B" }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#C0392B",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Red flags
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {(result.red_flags ?? []).map((f, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1A1A1A",
                    marginBottom: "4px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6B6B6B",
                    lineHeight: "1.55",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewrite comparison */}
      {result.rewrite && (
        <div
          style={{
            padding: "24px 28px",
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#A0A0A0",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Copy comparison — rewrite this
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#C0392B",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Your original
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "#6B6B6B",
                  lineHeight: "1.6",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                &ldquo;{result.rewrite.original}&rdquo;
              </p>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#2D6A4F",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Unfiltered suggestion
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "#1A1A1A",
                  lineHeight: "1.6",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                &ldquo;{result.rewrite.improved}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's action */}
      {result.today_action && (
        <div
          style={{
            padding: "28px",
            background: "#A8C5DA",
            borderRadius: "14px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "rgba(26,26,26,0.55)",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            One thing to do today
          </div>
          <p
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(17px, 2vw, 20px)",
              fontWeight: "400",
              color: "#1A1A1A",
              lineHeight: "1.5",
            }}
          >
            {result.today_action}
          </p>
          {result.today_action_label && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "rgba(26,26,26,0.6)",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              {result.today_action_label} →
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          borderTop: "1px solid rgba(26,26,26,0.08)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#A0A0A0",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Unfiltered — AI Portfolio Review
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Unfiltered — AI Portfolio Review",
                  text: `I got my portfolio reviewed by Unfiltered AI — scored ${result.score}/100. Brutally honest feedback for designers.`,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            style={{
              padding: "8px 16px",
              border: "1px solid rgba(26,26,26,0.15)",
              borderRadius: "999px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              color: "#3A3A3A",
            }}
          >
            Share score
          </button>
        </div>
      </div>
    </section>
  );
}
