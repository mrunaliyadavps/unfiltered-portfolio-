"use client";
import { useState } from "react";

const loadingLines = [
  "Reading between the lines...",
  "Thinking like a recruiter...",
  "Finding the gaps...",
  "No mercy mode activated...",
  "Almost there...",
];

export default function Home() {
  const [inputMode, setInputMode] = useState("url");
  const [urlValue, setUrlValue] = useState("");
  const [urlContext, setUrlContext] = useState("");
  const [textValue, setTextValue] = useState("");
  const [fetchStatus, setFetchStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingLines[0]);
  const [result, setResult] = useState(null);
  const [btnText, setBtnText] = useState("Get unfiltered feedback →");

  async function handleFetch() {
    if (!urlValue) return;
    setFetchStatus("Capturing URL...");
    setTimeout(() => setFetchStatus("✓ URL captured — ready to review"), 600);
  }

  async function runReview() {
    let content = "";
    if (inputMode === "url") {
      if (!urlValue) { alert("Please enter a URL first."); return; }
      content = `Portfolio URL: ${urlValue}`;
      if (urlContext) content += `\n\nContext from designer: ${urlContext}`;
    } else {
      content = textValue.trim();
      if (!content) { alert("Please paste your case study first."); return; }
    }

    setLoading(true);
    setResult(null);
    setBtnText("Analyzing...");

    let li = 0;
    const interval = setInterval(() => {
      li = (li + 1) % loadingLines.length;
      setLoadingText(loadingLines[li]);
    }, 2200);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({
        score: 50,
        verdict: "Something went wrong — please try again.",
        first_impression: "Unable to analyze at this time.",
        critiques: [],
        fixes: [],
        designer_level: "Unknown",
        level_read: "Please try again.",
      });
    }

    clearInterval(interval);
    setLoading(false);
    setBtnText("Review again →");
  }

  function shareResult(score) {
    const text = `I just got my portfolio reviewed by Unfiltered AI — scored ${score}/100.\n\nBrutally honest feedback for designers. Try it 👇\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: "Unfiltered — AI Portfolio Review", text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
    }
  }

  const scoreClass = result ? (result.score >= 75 ? "high" : result.score >= 50 ? "mid" : "low") : "";

  return (
    <>
      <div className="header">
        <div>
          <div className="wordmark">un<em>filtered</em></div>
          <div style={{ fontSize: "12px", color: "#5C5C5C", marginTop: "4px", fontWeight: 400 }}>
            AI portfolio review. No fluff. No lies.
          </div>
        </div>
        <div className="header-sub">Built by a designer, for designers</div>
      </div>

      <div className="body-wrap">
        <div className="input-col">
          <div>
            <div className="section-label">Input method</div>
            <div className="input-tabs">
              <button className={`itab${inputMode === "url" ? " on" : ""}`} onClick={() => setInputMode("url")}>Paste URL</button>
              <button className={`itab${inputMode === "text" ? " on" : ""}`} onClick={() => setInputMode("text")}>Paste text</button>
            </div>
          </div>

          {inputMode === "url" && (
            <div>
              <div className="section-label">Portfolio or case study URL</div>
              <div className="url-row">
                <input className="url-input" value={urlValue} onChange={e => setUrlValue(e.target.value)} placeholder="https://yourportfolio.com/case-study" />
                <button className="fetch-btn" onClick={handleFetch}>Fetch</button>
              </div>
              {fetchStatus && <div className="fetching-indicator" style={{ color: fetchStatus.includes("✓") ? "#2D7A4F" : "#9A9A9A" }}>{fetchStatus}</div>}
              <div style={{ marginTop: "16px" }}>
                <div className="section-label">Add context (optional)</div>
                <textarea className="text-area" style={{ height: "100px" }} value={urlContext} onChange={e => setUrlContext(e.target.value)} placeholder="Add context — role you're targeting, years of experience, what you want feedback on..." />
              </div>
            </div>
          )}

          {inputMode === "text" && (
            <div>
              <div className="section-label">Paste your case study</div>
              <textarea className="text-area" value={textValue} onChange={e => setTextValue(e.target.value)} placeholder="Paste your entire case study here — process, decisions, outcomes. The more you give, the more honest the feedback." />
              <div className="char-count">{textValue.length.toLocaleString()} chars</div>
            </div>
          )}

          <button className="roast-btn" disabled={loading} onClick={runReview}>{btnText}</button>

          <div className="disclaimer">
            ℹ This tool gives you the truth. Senior design lens, real hiring context, zero sugarcoating. If you&apos;re not ready for honest feedback, close this tab.
          </div>
        </div>

        <div className="output-col">
          {!loading && !result && (
            <div className="empty-output">
              <div className="empty-mark">&ldquo;</div>
              <p>Your feedback will appear here. Brace yourself — this is what recruiters actually think.</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loading-text">{loadingText}</div>
              <div className="loading-bar"><div className="loading-fill" /></div>
            </div>
          )}

          {result && !loading && (
            <div className="result-wrap">
              <div className="verdict-band">
                <div className="score-block">
                  <div className={`score-big ${scoreClass}`}>{result.score}</div>
                  <div className="score-denom">/100</div>
                </div>
                <div className="verdict-divider" />
                <div className="verdict-text">
                  <div className="verdict-label">The verdict</div>
                  <div className="verdict-one">{result.verdict}</div>
                </div>
              </div>

              <div className="first-impression">
                <div className="fi-label">Recruiter first impression</div>
                <div className="fi-timer">⏱ First 8 seconds</div>
                <div className="fi-text">{result.first_impression}</div>
              </div>

              <div className="two-col-panels">
                <div className="critique-panel">
                  <div className="cp-header">
                    <div className="cp-icon bad">✕</div>
                    <div className="cp-title bad">What&apos;s hurting you</div>
                  </div>
                  {(result.critiques || []).map((c, i) => (
                    <div className="critique-item" key={i}>
                      <div className="ci-num">0{i + 1}</div>
                      <div className="ci-title">{c.title}</div>
                      <div className="ci-body">{c.body}</div>
                    </div>
                  ))}
                </div>
                <div className="critique-panel">
                  <div className="cp-header">
                    <div className="cp-icon good">→</div>
                    <div className="cp-title good">Exact fixes</div>
                  </div>
                  {(result.fixes || []).map((f, i) => (
                    <div className="critique-item" key={i}>
                      <div className="ci-num">0{i + 1}</div>
                      <div className="ci-title">{f.title}</div>
                      <div className="ci-body">{f.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="level-card">
                <div className="lc-label">What this says about you</div>
                <div className="lc-level">{result.designer_level}</div>
                <div className="lc-text">{result.level_read}</div>
              </div>

              <div className="share-strip">
                <div className="share-text">Got a score worth sharing? Post it. Tag a designer friend who needs this.</div>
                <button className="share-btn" onClick={() => shareResult(result.score)}>Share my score</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <span>Unfiltered — AI Portfolio Review</span>
        <a href="https://mrunaliyadav.com" target="_blank" rel="noopener noreferrer">Built by Mrunali Yadav</a>
      </div>
    </>
  );
}
