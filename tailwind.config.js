/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "onyx-300": "#82978d",
        "onyx-400": "#6f8078",
        "onyx-500": "#5d6963",
        "onyx-600": "#515c56",
        "onyx-700": "#3e4742",
        "onyx-800": "#2e3532",
        "onyx-900": "#262c29",
        "reseda-green": "#739181",
        "french-gray": "#c7cedb",
        "cadet-gray": "#ADAAB2",
        "mountbatten-pink-300": "##a694ad",
        "mountbatten-pink-400": "#94849b",
        "mountbatten-pink-500": "#8e7f94",
        "mountbatten-pink-600": "#7c6e81",
        "mountbatten-pink-700": "#685a6c",
        "mountbatten-pink-800": "#4b404f",
        "mountbatten-pink-900": "#352e38",
      },
    },
  },
  plugins: [],
}

