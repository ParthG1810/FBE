import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1976d2",
      },
    },
  },
  plugins: [],
  // Important: This allows MUI to coexist with Tailwind without style conflicts
  corePlugins: {
    preflight: false,
  },
};
export default config;