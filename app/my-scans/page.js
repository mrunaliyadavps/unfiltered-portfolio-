"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";
import { createBrowserClient } from "@supabase/ssr";

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ScoreBadge({ score }) {
  const high = score >= 70;
  const mid = score >= 45;
  const gradient = high
    ? "linear-gradient(135deg, #A8C5DA, #7AAEC8)"
    : mid
    ? "linear-gradient(135deg, #E8C97A, #D4A84B)"
    : "linear-gradient(135deg, #E89090, #C0392B)";

  return (
    <div style={{
      width: "48px", height: "48px", borderRadius: "50%",
      background: gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      <span style={{
        fontFamily: "'SF Pro Display', -apple-system, sans-serif",
        fontSize: "15px", fontWeight: "600", color: "#fff",
        letterSpacing: "-0.5px",
      }}>
        {score}
      </span>
    </div>
  );
}

const HIRING_COLOR = {
  "WOULD SHORTLIST": "#2D6A4F",
  "MAYBE": "#B07D2E",
  "WOULD PASS": "#C0392B",
};

const HIRING_BG = {
  "WOULD SHORTLIST": "rgba(45,106,79,0.10)",
  "MAYBE": "rgba(176,125,46,0.10)",
  "WOULD PASS": "rgba(192,57,43,0.10)",
};

export default function MyScans() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data?.user ?? null;
      setUser(u);
      if (u) {
        const { data: rows } = await supabase
          .from("scans")
          .select("*")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false });
        setScans(rows ?? []);
      }
      setLoading(false);
    });
  }, []);

  const filtered = scans.filter(s =>
    !search || s.verdict?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: "60px", minHeight: "100vh", background: "var(--bg)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px", display: "flex", gap: "8px" }}>
            <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: "60px", minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: "360px", padding: "24px" }}>
            <h2 style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "24px", fontWeight: "400", color: "var(--ink)", marginBottom: "12px", letterSpacing: "-0.3px" }}>
              Your scan history
            </h2>
            <p style={{ fontSize: "14px", color: "var(--ink3)", marginBottom: "28px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", lineHeight: "1.6" }}>
              Sign in to save your portfolio reviews and track your progress over time.
            </p>
            <Link href="/auth" className="cta-btn" style={{ display: "inline-flex" }}>
              Sign in to continue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "60px", minHeight: "100vh", background: "var(--bg)", transition: "background 0.25s ease" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "60px 24px 80px" }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", fontSize: "28px", fontWeight: "400", color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: "4px" }}>
                Scan History
              </h1>
              <p style={{ fontSize: "13px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                {scans.length} {scans.length === 1 ? "review" : "reviews"} total
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--ink4)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search verdicts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 30px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "var(--bg-card-solid)",
                    color: "var(--ink)",
                    fontSize: "13px",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    outline: "none",
                    width: "200px",
                  }}
                />
              </div>

              <Link href="/analyze" className="cta-btn" style={{ fontSize: "13px", padding: "10px 18px" }}>
                New scan
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>

          {scans.length === 0 ? (
            <div style={{ padding: "60px 40px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", color: "var(--ink3)", marginBottom: "20px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                No scans yet. Analyze your portfolio to get started.
              </p>
              <Link href="/analyze" className="cta-btn" style={{ display: "inline-flex" }}>
                Analyze my portfolio
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          ) : (
            <div style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr 160px 110px 80px",
                gap: "0",
                padding: "12px 24px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg)",
              }}>
                {["Score", "Verdict", "Confidence", "Date", ""].map((h, i) => (
                  <div key={i} style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", fontWeight: "600" }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((scan, i) => (
                <div
                  key={scan.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr 160px 110px 80px",
                    gap: "0",
                    padding: "18px 24px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                    alignItems: "center",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Score */}
                  <div><ScoreBadge score={scan.score} /></div>

                  {/* Verdict */}
                  <div style={{ paddingRight: "20px" }}>
                    <p style={{
                      fontSize: "13px", fontStyle: "italic", color: "var(--ink)",
                      fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                      lineHeight: "1.45", marginBottom: "4px",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      &ldquo;{scan.verdict}&rdquo;
                    </p>
                    {scan.today_action && (
                      <p style={{ fontSize: "11px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        Next: {scan.today_action}
                      </p>
                    )}
                  </div>

                  {/* Hiring confidence */}
                  <div>
                    {scan.hiring_confidence && (
                      <span style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "10px",
                        fontWeight: "700",
                        letterSpacing: "0.3px",
                        color: HIRING_COLOR[scan.hiring_confidence] ?? "var(--ink4)",
                        background: HIRING_BG[scan.hiring_confidence] ?? "var(--bg)",
                        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                      }}>
                        {scan.hiring_confidence}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: "12px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                    {formatDate(scan.created_at)}
                  </div>

                  {/* Re-analyze */}
                  <div>
                    <Link href="/analyze" style={{
                      fontSize: "12px", color: "var(--blue)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                      fontWeight: "500", textDecoration: "none", whiteSpace: "nowrap",
                    }}>
                      Re-analyze →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
