"use client";
import { useState } from "react";

const loadingLines = [
  "Reading your case study...",
  "Thinking like a recruiter...",
  "Checking research depth...",
  "Evaluating storytelling...",
  "Finding your weakest sentence...",
  "Almost there...",
];

const industries = ["Tech", "Fintech", "Healthcare", "Consumer", "Enterprise", "Agency", "Other"];

function genReportNum() {
  return `#${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}

function todayDate() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Home() {
  const [inputMode, setInputMode] = useState("url");
  const [urlValue, setUrlValue] = useState("");
  const [urlContext, setUrlContext] = useState("");
  const [textValue, setTextValue] = useState("");
  const [fetchStatus, setFetchStatus] = useState("");
  const [seniority, setSeniority] = useState("Mid-level");
  const [industry, setIndustry] = useState("Tech");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingLines[0]);
  const [result, setResult] = useState(null);
  const [reportNum] = useState(genReportNum());
  const [btnText, setBtnText] = useState("Get unfiltered feedback");

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
      if (urlContext) content += `\n\nContext: ${urlContext}`;
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
    }, 2000);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, seniority, industry }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }

    clearInterval(interval);
    setLoading(false);
    setBtnText("Review again →");
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));
  }

  function shareScore() {
    if (!result) return;
    const text = `I just got my portfolio reviewed by Unfiltered AI — scored ${result.score}/100.\n\nBrutally honest feedback for designers. Try it 👇\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: "Unfiltered — AI Portfolio Review", text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
    }
  }

  const scoreClass = result ? (result.score >= 75 ? "high" : result.score >= 50 ? "mid" : "low") : "";
  const hiringClass = result ? (result.hiring_confidence === "WOULD SHORTLIST" ? "shortlist" : result.hiring_confidence === "MAYBE" ? "maybe" : "pass") : "";

  return (
    <>
      <div className="header">
        <div>
          <div className="wordmark"><em>Un</em>filtered</div>
          <div style={{ fontSize: "11px", color: "#9A9A9A", marginTop: "3px", fontWeight: 400 }}>
            AI portfolio review. No fluff. No lies.
          </div>
        </div>
        <div className="header-sub">Built by a designer, for designers</div>
      </div>

      <div className="body-wrap">
        <div className="input-col">
          <div>
            <div className="input-tabs">
              <button className={`itab${inputMode === "url" ? " on" : ""}`} onClick={() => setInputMode("url")}>Paste URL</button>
              <button className={`itab${inputMode === "text" ? " on" : ""}`} onClick={() => setInputMode("text")}>Paste text</button>
            </div>
          </div>

          <div>
            <div className="section-label">Role seniority</div>
            <div className="seniority-group">
              {["Junior", "Mid-level", "Senior"].map(s => (
                <button key={s} className={`sen-btn${seniority === s ? " on" : ""}`} onClick={() => setSeniority(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Focus industry</div>
            <select className="industry-select" value={industry} onChange={e => setIndustry(e.target.value)}>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>

          {inputMode === "url" && (
            <div>
              <div className="section-label">Paste case study URL</div>
              <div className="url-row">
                <input className="url-input" value={urlValue} onChange={e => setUrlValue(e.target.value)} placeholder="https://yourportfolio.com/case-study" />
                <button className="fetch-btn" onClick={handleFetch}>Fetch</button>
              </div>
              {fetchStatus && <div className="fetching-indicator" style={{ color: fetchStatus.includes("✓") ? "#2D6A4F" : "#9A9A9A" }}>{fetchStatus}</div>}
              <div style={{ marginTop: "14px" }}>
                <div className="section-label">Context or raw text (optional)</div>
                <textarea className="text-area" style={{ height: "110px" }} value={urlContext} onChange={e => setUrlContext(e.target.value)} placeholder="Paste your problem statement or context here for a deeper review..." />
              </div>
            </div>
          )}

          {inputMode === "text" && (
            <div>
              <div className="section-label">Paste your case study</div>
              <textarea className="text-area" value={textValue} onChange={e => setTextValue(e.target.value)} placeholder="Paste your entire case study here — process, decisions, outcomes, anything you'd show a hiring manager." />
              <div className="char-count">{textValue.length.toLocaleString()} chars</div>
            </div>
          )}

          <button className="roast-btn" disabled={loading} onClick={runReview}>
            <span>{btnText}</span>
            <span>→</span>
          </button>

          <div className="disclaimer">
            ℹ Reviews are powered by AI. No fluff. No lies. Just growth.
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
              <div className="report-header">
                <div>
                  <div className="report-num">REPORT {reportNum}</div>
                </div>
                <div className="report-date">
                  ANALYZED ON
                  <span>{todayDate()}</span>
                </div>
              </div>

              <div className="verdict-section">
                <div className="verdict-left">
                  <div className="verdict-title">The Verdict.</div>
                  <div className="score-display">
                    <div className={`score-num ${scoreClass}`}>{result.score}</div>
                    <div className="score-denom">/100</div>
                  </div>
                  <div className="verdict-quote">&ldquo;{result.verdict}&rdquo;</div>
                  <div className="verdict-summary">{result.summary}</div>
                </div>

                <div className="verdict-right">
                  <div>
                    <div className="hiring-conf-label">Hiring confidence</div>
                    <div className={`hiring-badge ${hiringClass}`}>{result.hiring_confidence}</div>
                  </div>
                  <div className="sub-scores">
                    {result.sub_scores && Object.entries(result.sub_scores).map(([key, val]) => (
                      <div className="sub-score-row" key={key}>
                        <div className="sub-score-label">{key.replace("_", " ")}</div>
                        <div className="sub-score-val">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flags-section">
                <div className="flags-col">
                  <div className="flags-header">
                    <div className="flags-dot green"></div>
                    <div className="flags-title">Green flags</div>
                  </div>
                  {(result.green_flags || []).map((f, i) => (
                    <div className="flag-item" key={i}>
                      <div className="flag-icon g">✓</div>
                      <div className="flag-body">
                        <div className="flag-title">{f.title}</div>
                        <div className="flag-desc">{f.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flags-col">
                  <div className="flags-header">
                    <div className="flags-dot red"></div>
                    <div className="flags-title">Red flags</div>
                  </div>
                  {(result.red_flags || []).map((f, i) => (
                    <div className="flag-item" key={i}>
                      <div className="flag-icon r">!</div>
                      <div className="flag-body">
                        <div className="flag-title">{f.title}</div>
                        <div className="flag-desc">{f.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.rewrite && (
                <div className="rewrite-section">
                  <div className="rewrite-label">Copy comparison — rewrite this sentence</div>
                  <div className="rewrite-grid">
                    <div className="rewrite-box original">
                      <div className="rewrite-box-label">Your original</div>
                      <div className="rewrite-text">&ldquo;{result.rewrite.original}&rdquo;</div>
                    </div>
                    <div className="rewrite-box improved">
                      <div className="rewrite-box-label">Unfiltered suggestion</div>
                      <div className="rewrite-text">&ldquo;{result.rewrite.improved}&rdquo;</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="today-section">
                <div style={{ fontSize: "13px", color: "var(--ink3)", lineHeight: 1.7 }}>
                  The single most impactful change you can make right now — not tomorrow, not after you redesign everything. Just this one thing.
                </div>
                <div className="today-card">
                  <div className="today-label">Actionable takeaway</div>
                  <div className="today-title">One thing to<br />do TODAY</div>
                  <div className="today-action">{result.today_action}</div>
                  {result.today_action_label && (
                    <div className="today-action-label">{result.today_action_label} →</div>
                  )}
                </div>
              </div>

              <div className="bottom-bar">
                <div className="bottom-left">Unfiltered — AI Portfolio Review</div>
                <div className="bottom-btns">
                  <button className="btn-outline" onClick={copyLink}>Copy link</button>
                  <button className="btn-solid" onClick={shareScore}>Share score</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <span>Unfiltered</span>
        <a href="https://mrunaliyadav.com" target="_blank" rel="noopener noreferrer">Built by Mrunali Yadav</a>
      </div>
    </>
  );
}
