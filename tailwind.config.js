/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [".clients/src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  plugins: [require("flowbite/plugin")],
};
