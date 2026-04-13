"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: "var(--nav-bg)",
      borderBottom: "1px solid var(--border)",
      transition: "background-color 0.25s ease, border-color 0.25s ease",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 32px",
        height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" className="wordmark">unfiltered</Link>

        <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          <Link href="/my-scans" className={`nav-link${pathname === "/my-scans" ? " active" : ""}`}>My Scans</Link>
          <Link href="/blog" className={`nav-link${pathname === "/blog" ? " active" : ""}`}>Blog</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Avatar / sign in */}
          <div style={{ position: "relative" }}>
            {user ? (
              <>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: "var(--blue)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "600", color: "#1A1A1A",
                  }}
                >
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </button>
                {menuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "44px",
                    background: "var(--bg-card-solid)", border: "1px solid var(--border)",
                    borderRadius: "12px", padding: "8px", minWidth: "190px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  }}>
                    <div style={{ fontSize: "12px", color: "var(--ink3)", padding: "8px 10px 12px", borderBottom: "1px solid var(--border)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      {user.email}
                    </div>
                    <Link href="/my-scans" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "10px", fontSize: "13px", color: "var(--ink2)", textDecoration: "none", borderRadius: "6px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      My Scans
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--ink2)", borderRadius: "6px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/auth" style={{ display: "flex" }}>
                <button className="theme-toggle" aria-label="Sign in">
                  <UserIcon />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
