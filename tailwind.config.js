/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        "flag-plant": {
          "0%": {
            transform: "scale(0) translateY(-20px) rotate(-20deg)",
            opacity: "0",
          },
          "50%": { transform: "scale(1.2) translateY(5px) rotate(10deg)" },
          "100%": {
            transform: "scale(1) translateY(0) rotate(0deg)",
            opacity: "1",
          },
        },
        "flag-wave": {
          "0%, 100%": { transform: "skewY(0deg)" },
          "50%": { transform: "skewY(-6deg)" },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "flag-deploy":
          "flag-plant 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "flag-steady": "flag-wave 2s ease-in-out infinite",
      },
    },
  },
};
