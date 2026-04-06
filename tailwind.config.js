/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/components/AboutContactSection.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'vicky': {
          'bg': '#FFF5F7',
          'primary': '#2D1B22',
          'accent': '#D81B60',
          'soft': '#F48FB1',
          'gold': '#D4AF37',
          'glass': 'rgba(255, 255, 255, 0.6)',
          'glass-hover': 'rgba(255, 255, 255, 0.9)',
          'border': 'rgba(216, 27, 96, 0.1)',
        }
      },
      fontFamily: {
        'outfit': ['"Outfit"', 'system-ui', 'sans-serif'],
        'handwriting': ['"Dancing Script"', 'cursive'],
        'script': ['"Alex Brush"', 'cursive'],
        'luxury': ['"Pinyon Script"', 'cursive'],
        'varela': ['"Varela Round"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'ultra': '0.25em',
        'widest': '0.2em',
        'wider': '0.12em',
        'wide': '0.06em',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}
