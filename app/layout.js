import "./globals.css";

export const metadata = {
  title: "Unfiltered — AI Portfolio Review for Designers",
  description:
    "See how hiring managers will read your portfolio. Get scored, structured feedback across visual craft, storytelling, research depth, and impact.",
  openGraph: {
    title: "Unfiltered — AI Portfolio Review",
    description: "Brutally honest portfolio feedback for product designers.",
    siteName: "Unfiltered",
  },
};

// Runs before React hydrates — prevents flash of wrong theme
const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
