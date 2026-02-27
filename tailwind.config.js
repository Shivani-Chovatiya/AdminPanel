/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF6B35", // vibrant orange for headings/buttons
        "peach-light": "#FFF5EE",
        "peach-medium": "#FFE4D9",
        "accent-orange": "#FF4500",
        primary: "#D04500",
      },
    },
  },
  plugins: [],
};
