import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "border-spin": { "100%": { transform: "rotate(-360deg)" } },
        bikeTire: {
          "0%": { transform: "rotate(0)", strokeDashoffset: "56.549" },
          "33%": { transform: "rotate(0.33turn)", strokeDashoffset: "0" },
          "67%": { transform: "rotate(0.67turn)", strokeDashoffset: "0" },
          "100%": { transform: "rotate(1turn)", strokeDashoffset: "-56.549" },
        },
        bikePedals: {
          "0%": { strokeDashoffset: "-25.133" },
          "33%": { strokeDashoffset: "-21.991" },
          "67%": { strokeDashoffset: "-21.991" },
          "100%": { strokeDashoffset: "-25.133" },
        },
        bikePedalsSpin: {
          "0%": { transform: "rotate(0.1875turn)" },
          "100%": { transform: "rotate(3.1875turn)" },
        },
        bikeSpokes: {
          "0%": { strokeDashoffset: "-31.416" },
          "33%": { strokeDashoffset: "-23.562" },
          "67%": { strokeDashoffset: "-23.562" },
          "100%": { strokeDashoffset: "-31.416" },
        },
        bikeSpokesSpin: {
          "0%": { transform: "rotate(0)" },
          "100%": { transform: "rotate(3turn)" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        bikeTire: "bikeTire 3s ease-in-out infinite",
        bikePedals: "bikePedals 3s ease-in-out infinite",
        bikePedalsSpin: "bikePedalsSpin 3s ease-in-out infinite",
        bikeSpokes: "bikeSpokes 3s ease-in-out infinite",
        bikeSpokesSpin: "bikeSpokesSpin 3s ease-in-out infinite",
        borderSpin: "border-spin 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), flowbite.plugin()],
};

export default config;
