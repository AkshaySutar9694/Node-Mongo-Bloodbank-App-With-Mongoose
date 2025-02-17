/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.js", // JS files for dynamic behavior in the public folder
    "./views/**/*.ejs", // EJS templates for server-rendered views
    "./src/**/*.{js,jsx,ts,tsx,html}", // Any other source directories
    "./node_modules/tw-elements/dist/js/**/*.js", // Correct tw-elements path
  ],
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs")],
};
