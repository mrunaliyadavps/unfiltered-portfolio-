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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
