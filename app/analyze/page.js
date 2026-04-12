"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "../../components/Nav";
import ScoreCard from "../../components/ScoreCard";

const loadingLines = [
  "Reading your case study...",
  "Thinking like a recruiter...",
  "Checking research depth...",
  "Evaluating storytelling...",
  "Finding your weakest sentence...",
  "Almost there...",
];

function AnalyzePage() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") ?? "";
  const defaultIndustry = searchParams.get("industry") ?? "";
  const defaultUrl = searchParams.get("url") ?? "";

  const [inputMode, setInputMode] = useState("url");
  const [urlValue, setUrlValue] = useState(defaultUrl);
  const [textValue, setTextValue] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [industry, setIndustry] = useState(defaultIndustry);
  const [seniority, setSeniority] = useState("Mid-level");

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingLines[0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  async function runReview() {
    let content = "";
    if (inputMode === "url") {
      if (!urlValue.trim()) { setError("Please enter a portfolio URL."); return; }
      content = `Portfolio URL: ${urlValue}`;
      if (role) content += `\n\nTarget role: ${role}`;
      if (industry) content += `\nTarget industry: ${industry}`;
    } else {
      content = textValue.trim();
      if (!content) { setError("Please paste your case study text."); return; }
    }

    setError(null);
    setLoading(true);
    setResult(null);

    let li = 0;
    const interval = setInterval(() => {
      li = (li + 1) % loadingLines.length;
      setLoadingText(loadingLines[li]);
    }, 2200);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, seniority, industry }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }

    clearInterval(interval);
    setLoading(false);
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>

        {/* Input section */}
        <section
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "60px 24px 48px",
          }}
        >
          <h2
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: "400",
              color: "#1A1A1A",
              marginBottom: "8px",
              letterSpacing: "-0.3px",
            }}
          >
            Upload your portfolio
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6B6B6B",
              marginBottom: "36px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            Paste a URL or your case study text. We&apos;ll analyze it in under 30 seconds.
          </p>

          {/* Input mode tabs */}
          <div
            style={{
              display: "flex",
              gap: "0",
              borderBottom: "1px solid rgba(26,26,26,0.10)",
              marginBottom: "28px",
            }}
          >
            {["url", "text"].map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                style={{
                  padding: "10px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  fontWeight: inputMode === mode ? "600" : "400",
                  color: inputMode === mode ? "#1A1A1A" : "#6B6B6B",
                  borderBottom: inputMode === mode ? "2px solid #A8C5DA" : "2px solid transparent",
                  marginBottom: "-1px",
                  transition: "all 0.2s",
                }}
              >
                {mode === "url" ? "Paste URL" : "Paste text"}
              </button>
            ))}
          </div>

          {/* Context row */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Seniority */}
            <div style={{ flex: 1, minWidth: "180px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#A0A0A0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Seniority
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {["Junior", "Mid-level", "Senior"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeniority(s)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid",
                      borderColor: seniority === s ? "#A8C5DA" : "rgba(26,26,26,0.12)",
                      borderRadius: "999px",
                      background: seniority === s ? "rgba(168,197,218,0.15)" : "transparent",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: seniority === s ? "#1A1A1A" : "#6B6B6B",
                      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div style={{ flex: 1, minWidth: "180px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#A0A0A0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Target role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Product Designer"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid rgba(26,26,26,0.12)",
                  borderRadius: "8px",
                  background: "transparent",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  outline: "none",
                }}
              />
            </div>

            {/* Industry */}
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#A0A0A0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid rgba(26,26,26,0.12)",
                  borderRadius: "8px",
                  background: "transparent",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* URL input */}
          {inputMode === "url" && (
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#A0A0A0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Portfolio or case study URL
              </label>
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://yourportfolio.com/case-study"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid rgba(26,26,26,0.12)",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.6)",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Text input */}
          {inputMode === "text" && (
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#A0A0A0",
                  fontWeight: "600",
                  marginBottom: "8px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                Paste your case study
              </label>
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Paste your case study here — process, decisions, outcomes, anything you'd show a hiring manager."
                rows={10}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid rgba(26,26,26,0.12)",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.6)",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
              />
              <div
                style={{
                  fontSize: "11px",
                  color: "#A0A0A0",
                  marginTop: "6px",
                  textAlign: "right",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                }}
              >
                {textValue.length.toLocaleString()} chars
              </div>
            </div>
          )}

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "#C0392B",
                marginBottom: "16px",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              {error}
            </p>
          )}

          <button
            className="cta-btn"
            onClick={runReview}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Analyzing..." : "Get unfiltered feedback"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>

          <p
            style={{
              fontSize: "12px",
              color: "#A0A0A0",
              marginTop: "14px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            Powered by Claude. No fluff. No lies. Just growth.
          </p>
        </section>

        {/* Loading state */}
        {loading && (
          <section
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              padding: "0 24px 60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#6B6B6B",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontStyle: "italic",
              }}
            >
              {loadingText}
            </p>
          </section>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultsRef}>
            <ScoreCard result={result} />
          </div>
        )}
      </main>
    </>
  );
}

export default function AnalyzePageWrapper() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "60px" }}><Nav /></div>}>
      <AnalyzePage />
    </Suspense>
  );
}
