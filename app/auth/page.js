"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // If already signed in, redirect
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace("/my-scans");
    });
  }, []);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { newsletter_opt_in: newsletter },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Check your email to confirm your account, then come back to sign in.");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/my-scans");
      }
    }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    background: "var(--bg)",
    color: "var(--ink)",
    fontSize: "14px",
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      transition: "background 0.25s ease",
    }}>
      {/* Wordmark */}
      <Link href="/" style={{
        fontFamily: "'SF Compact Display', 'SF Pro Display', -apple-system, sans-serif",
        fontWeight: "300",
        fontSize: "22px",
        color: "var(--ink)",
        textDecoration: "none",
        marginBottom: "40px",
        letterSpacing: "-0.3px",
      }}>
        unfiltered
      </Link>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--bg-card-solid)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        padding: "36px 32px",
      }}>
        <h1 style={{
          fontFamily: "'SF Pro Display', -apple-system, sans-serif",
          fontSize: "22px",
          fontWeight: "400",
          color: "var(--ink)",
          marginBottom: "6px",
          letterSpacing: "-0.3px",
        }}>
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{
          fontSize: "13px",
          color: "var(--ink3)",
          marginBottom: "28px",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}>
          {mode === "signin"
            ? "Sign in to see your scan history."
            : "Get honest, scored feedback on your portfolio."}
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            background: "var(--bg)",
            color: "var(--ink)",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
            transition: "background 0.15s",
          }}
        >
          {/* Google icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.8 0-14.5 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.4 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.4 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "11px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            or
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {/* Newsletter opt-in (sign up only) */}
          {mode === "signup" && (
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              marginTop: "4px",
            }}>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
                style={{ marginTop: "2px", accentColor: "var(--blue)", width: "14px", height: "14px", flexShrink: 0 }}
              />
              <span style={{
                fontSize: "12px",
                color: "var(--ink3)",
                lineHeight: "1.5",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}>
                Send me tips on improving my portfolio and hiring insights. No spam.
              </span>
            </label>
          )}

          {/* Error / success */}
          {error && (
            <p style={{ fontSize: "13px", color: "#C0392B", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", margin: 0 }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ fontSize: "13px", color: "#2D6A4F", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", margin: 0, lineHeight: "1.5" }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cta-btn"
            style={{ width: "100%", justifyContent: "center", marginTop: "4px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Toggle mode */}
        <p style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "13px",
          color: "var(--ink3)",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--blue)", fontWeight: "600", fontSize: "13px",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              textDecoration: "underline",
            }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <p style={{ marginTop: "20px", fontSize: "11px", color: "var(--ink4)", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", textAlign: "center", maxWidth: "300px", lineHeight: "1.5" }}>
        By continuing you agree to our terms. Your email is never shared or sold.
      </p>
    </div>
  );
}
