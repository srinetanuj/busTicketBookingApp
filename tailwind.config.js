module.exports = {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.jsx",
  ],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      colors: {
        primary: "#1f2937",
        secondary: "#3b82f6",
        accent: "#f97316",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
