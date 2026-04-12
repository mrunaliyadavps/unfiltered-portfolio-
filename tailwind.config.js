/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E8",
        paper2: "#EDE8DF",
        ink: "#1A1A1A",
        ink2: "#3A3A3A",
        ink3: "#6B6B6B",
        ink4: "#A0A0A0",
        blue: {
          pastel: "#A8C5DA",
          hover: "#7AAEC8",
          dim: "rgba(168, 197, 218, 0.15)",
        },
        border: "rgba(26, 26, 26, 0.10)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["SF Pro Display", "SF Compact Display", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
