/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
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

        "bounce-short": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25%)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "flag-deploy":
          "flag-plant 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "flag-steady": "flag-wave 2s ease-in-out infinite",
        "bounce-short": "bounce-short 0.5s infinite", // Dùng cho icon cờ/mìn nhảy nhót
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both", // Dùng khi mìn nổ
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        'neon-blue': '0 0 20px 2px rgba(56, 189, 248, 0.45)',
        'neon-pink': '0 0 20px 2px rgba(244, 63, 94, 0.45)',
        'neon-yellow': '0 0 20px 2px rgba(253, 224, 71, 0.45)',
        'neon-green': '0 0 20px 2px rgba(34, 197, 94, 0.45)',
      },
    },
  },
};
