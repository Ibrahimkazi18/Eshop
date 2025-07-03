
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '../seller-ui/src/**/*.{js,jsx,ts,tsx,html}',
    '../../packages/components/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
//     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      fontFamily : {
        Roboto: ["var(--font-roboto)"],
        Poppins: ["var(--font-poppins)"],
        Jost: ["var(--font-jost)"],
      }
    },
  },
  plugins: [],
};
