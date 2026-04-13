"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [url, setUrl] = useState("");

  function handleContinue() {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (industry) params.set("industry", industry);
    if (url) params.set("url", url);
    router.push(`/analyze?${params.toString()}`);
  }

  return (
    <>
      <Nav />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "60px",
          paddingBottom: "80px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        {/* Hero */}
        <div
          style={{
            maxWidth: "680px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: "400",
              lineHeight: "1.18",
              letterSpacing: "-0.5px",
              color: "var(--ink)",
              marginBottom: "20px",
            }}
          >
            See how hiring managers will read your portfolio
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: "16px",
              color: "var(--ink3)",
              lineHeight: "1.6",
              maxWidth: "480px",
              marginBottom: "52px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            Tell us what role you want. Drop your portfolio link. See exactly where the gaps are.
          </p>

          {/* Inline input sentence */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              fontSize: "clamp(18px, 2.5vw, 22px)",
              color: "var(--ink)",
              fontWeight: "400",
              lineHeight: "1.8",
              marginBottom: "36px",
            }}
          >
            <span>I want to become a</span>
            <input
              className="inline-input"
              style={{ fontSize: "inherit", fontFamily: "inherit" }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Product Designer"
              aria-label="Target role"
            />
            <span>in</span>
            <input
              className="inline-input"
              style={{ fontSize: "inherit", fontFamily: "inherit", minWidth: "120px" }}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., fintech"
              aria-label="Target industry"
            />
          </div>

          {/* Portfolio URL input */}
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              marginBottom: "20px",
            }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your portfolio or case study URL"
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                background: "var(--bg-card)",
                fontSize: "15px",
                color: "var(--ink)",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                outline: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            />
          </div>

          {/* CTA button */}
          <button className="cta-btn" onClick={handleContinue} style={{ marginBottom: "36px" }}>
            Continue to upload your portfolio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Example card */}
          <div
            style={{
              background: "var(--bg-card-solid)",
              border: "1px solid var(--border-soft)",
              borderRadius: "14px",
              padding: "20px 24px",
              maxWidth: "540px",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                color: "var(--ink4)",
                fontWeight: "600",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Example
            </div>
            <p
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                color: "var(--ink2)",
                lineHeight: "1.65",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              &ldquo;You&apos;re a product designer who thinks in systems, not just screens. But your
              portfolio reads like a task list, not a product story.&rdquo;
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border-soft)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "var(--ink4)",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <span>unfiltered</span>
        <a
          href="https://mrunaliyadav.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--ink4)", textDecoration: "none" }}
        >
          Built by Mrunali Yadav
        </a>
      </footer>
    </>
  );
}
