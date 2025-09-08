import starlightPlugin from '@astrojs/starlight-tailwind'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../cli/src/components/**/*.{astro,js,ts}',
  ],
  theme: {
    fontFamily: {
      // sans: ['Graphik', 'sans-serif'],
      // serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.green,
        neutral: colors.gray,
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [starlightPlugin()],
}
