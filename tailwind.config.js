/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FCAE42",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
