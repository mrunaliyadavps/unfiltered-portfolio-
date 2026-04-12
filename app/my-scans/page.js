"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../../components/Nav";
import { createBrowserClient } from "@supabase/ssr";

function todayDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const HIRING_COLOR = {
  "WOULD SHORTLIST": "#2D6A4F",
  MAYBE: "#B07D2E",
  "WOULD PASS": "#C0392B",
};

export default function MyScans() {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <>
      <Nav />
      <main
        style={{
          paddingTop: "60px",
          minHeight: "100vh",
          maxWidth: "720px",
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <h1
          style={{
            fontFamily: "'SF Pro Display', -apple-system, sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: "400",
            color: "#1A1A1A",
            marginBottom: "8px",
            letterSpacing: "-0.3px",
          }}
        >
          My Scans
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6B6B6B",
            marginBottom: "40px",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Your portfolio review history.
        </p>

        {loading ? (
          <div style={{ display: "flex", gap: "8px", paddingTop: "20px" }}>
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        ) : !user ? (
          <div
            style={{
              padding: "40px",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "#3A3A3A",
                marginBottom: "20px",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Sign in to save and revisit your scans.
            </p>
            <button className="cta-btn" onClick={handleSignIn}>
              Sign in with Google
            </button>
          </div>
        ) : scans.length === 0 ? (
          <div
            style={{
              padding: "40px",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "#6B6B6B",
                marginBottom: "20px",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              No scans yet. Get your first review.
            </p>
            <Link href="/analyze" className="cta-btn">
              Analyze my portfolio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {scans.map((scan) => (
              <div
                key={scan.id}
                style={{
                  padding: "22px 24px",
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(26,26,26,0.08)",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontStyle: "italic",
                      color: "#1A1A1A",
                      marginBottom: "6px",
                      fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                    }}
                  >
                    &ldquo;{scan.verdict}&rdquo;
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#A0A0A0",
                      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    }}
                  >
                    {todayDate(scan.created_at)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                      fontSize: "32px",
                      fontWeight: "300",
                      lineHeight: "1",
                      color: "#1A1A1A",
                    }}
                  >
                    {scan.score}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: HIRING_COLOR[scan.hiring_confidence] ?? "#A0A0A0",
                      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {scan.hiring_confidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
