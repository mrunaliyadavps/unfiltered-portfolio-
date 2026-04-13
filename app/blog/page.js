import Nav from "../../components/Nav";

const posts = [
  {
    slug: "storytelling-not-task-lists",
    title: "Your portfolio is a task list. Here's how to make it a story.",
    date: "April 8, 2025",
    excerpt:
      "Most designers document what they did. Hiring managers want to know why you did it, what you were afraid of getting wrong, and whether your instincts can be trusted. Here's how to reframe every case study.",
    tag: "Storytelling",
  },
  {
    slug: "impact-numbers-that-matter",
    title: "The right way to use numbers in your case study",
    date: "March 24, 2025",
    excerpt:
      "Not all metrics are equal. '10% increase in conversions' lands differently depending on context. We break down which numbers signal real impact and which ones hiring managers discount immediately.",
    tag: "Impact",
  },
  {
    slug: "research-depth-signal",
    title: "How hiring managers read for research depth in under 2 minutes",
    date: "March 10, 2025",
    excerpt:
      "Senior designers are hired for their judgment, not their deliverables. But your portfolio has to prove judgment exists — and most portfolios don't. Here's exactly what reviewers look for.",
    tag: "Research",
  },
];

export default function Blog() {
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
            color: "var(--ink)",
            marginBottom: "8px",
            letterSpacing: "-0.3px",
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ink3)",
            marginBottom: "48px",
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          Honest advice on making your portfolio work harder.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {posts.map((post, i) => (
            <article
              key={post.slug}
              style={{
                padding: "32px 0",
                borderTop: i === 0 ? "1px solid var(--border)" : undefined,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--blue)",
                    fontWeight: "600",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {post.tag}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--ink4)",
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  }}
                >
                  {post.date}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: "400",
                  color: "var(--ink)",
                  lineHeight: "1.35",
                  letterSpacing: "-0.2px",
                  marginBottom: "12px",
                  cursor: "pointer",
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--ink3)",
                  lineHeight: "1.65",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  marginBottom: "16px",
                }}
              >
                {post.excerpt}
              </p>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--blue)",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Read more →
              </span>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
