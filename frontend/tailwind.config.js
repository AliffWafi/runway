/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gruvbox Dark Base Colors
        gruvHard: '#1d2021',
        gruvBg: '#282828',
        gruvSoft: '#32302f',
        gruvCard: 'rgba(60, 56, 54, 0.75)',
        gruvBorder: '#504945',
        
        // Gruvbox Text Tokens
        gruvFg: '#ebdbb2',
        gruvMuted: '#a89984',

        // Gruvbox Vibrant Accents
        gruvRed: '#fb4934',
        gruvGreen: '#b8bb26',
        gruvYellow: '#fabd2f',
        gruvBlue: '#83a598',
        gruvPurple: '#d3869b',
        gruvAqua: '#8ec07c',
        gruvOrange: '#fe8019',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
