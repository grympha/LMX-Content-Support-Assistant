import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        slatePanel: "#233241",
        mist: "#eef3f7",
        line: "#d8e0e7",
        signal: "#0f766e",
        amberSoft: "#f8d784"
      },
      boxShadow: {
        panel: "0 16px 45px rgba(24, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
