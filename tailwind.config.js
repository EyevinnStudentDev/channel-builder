/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/daisyui/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      boxShadow: {
        inner: 'inset 4px 2px 4px 0 rgb(0 0 0 / 0.25);'
      },
      colors: {
        white: '#ffffff',
        black: '#0C0C0C'
      },
      gridTemplateColumns: {
        'responsive-columns':
          'repeat(auto-fit, minmax(min(18.75rem, 100%), 1fr));',
        'md-responsive-columns':
          'repeat(auto-fit, minmax(min(100%, 200px), 1fr));',
        'lg-responsive-columns':
          'repeat(auto-fit, minmax(min(100%, 200px), 300px));',
        'xl-responsive-columns':
          'repeat(auto-fit, minmax(min(100%, 200px), 400px));'
      },
      screens: {
        '3xl': '1900px'
      }
    }
  },
  darkMode: 'class', // DaisyUI themes respect dark mode
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#BEE6FD',
          secondary: '#A64DFF',
          accent: '#17C964',
          neutral: '#292929',
          'base-100': '#0C0C0C',
          'base-content': '#E4E4E7',
          info: '#BEE6FD',
          success: '#17C964',
          warning: '#FAAB4E',
          error: '#E15050'
        }
      },
      'dark', // Include DaisyUI's default dark theme
      'light' // Include DaisyUI's default light theme for toggling
    ]
  }
};
