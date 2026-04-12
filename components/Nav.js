"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#F5F0E8",
        borderBottom: "1px solid rgba(26,26,26,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Wordmark */}
        <Link href="/" className="wordmark">
          unfiltered
        </Link>

        {/* Center nav */}
        <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          <Link
            href="/my-scans"
            className={`nav-link${pathname === "/my-scans" ? " active" : ""}`}
          >
            My Scans
          </Link>
          <Link
            href="/blog"
            className={`nav-link${pathname === "/blog" ? " active" : ""}`}
          >
            Blog
          </Link>
        </nav>

        {/* Right: avatar / sign in */}
        <div style={{ position: "relative" }}>
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#A8C5DA",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#1A1A1A",
                }}
              >
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "44px",
                    background: "#F5F0E8",
                    border: "1px solid rgba(26,26,26,0.10)",
                    borderRadius: "10px",
                    padding: "8px",
                    minWidth: "160px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B6B6B",
                      padding: "8px 10px 12px",
                      borderBottom: "1px solid rgba(26,26,26,0.08)",
                    }}
                  >
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#3A3A3A",
                      marginTop: "4px",
                      borderRadius: "6px",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleSignIn}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "rgba(26,26,26,0.08)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
