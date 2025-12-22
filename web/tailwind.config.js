/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f5f5f7',
        'surface-hover': '#eaeaec',
        primary: '#000000',
        secondary: '#86868b',
        accent: '#0066cc',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 8px 16px rgba(0, 0, 0, 0.06)',
        'float': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'inner-light': 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
}

