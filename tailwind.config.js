/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tes couleurs personnalisées
        primary: '#d4af37',      // Le "Gold" du logo
        'primary-dark': '#b5952f', // Gold un peu plus foncé (pour les survols)
        'ebf-black': '#1a1a1a',  // Le fond noir luxe
      },
    },
  },
  plugins: [],
};