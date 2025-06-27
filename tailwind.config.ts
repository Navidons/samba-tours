import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("./lib/shadcn-preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // African-themed color palette
        forest: {
          50: "#f0f9f0",
          100: "#dcf2dc",
          200: "#bce5bc",
          300: "#8dd18d",
          400: "#5bb85b",
          500: "#3a9f3a",
          600: "#2d7d2d", // Primary green
          700: "#256325",
          800: "#1f4f1f",
          900: "#1a3f1a",
        },
        cream: {
          50: "#fefdf8",
          100: "#fdfbf0",
          200: "#faf6e0",
          300: "#f5edc4", // Beige
          400: "#ede0a3",
          500: "#e3d082",
          600: "#d4bc5e",
          700: "#b8a04a",
          800: "#967f3f",
          900: "#7a6635",
        },
        earth: {
          50: "#f7f5f3",
          100: "#ede8e3",
          200: "#ddd4c7",
          300: "#c7b8a4",
          400: "#b09981",
          500: "#9d8268",
          600: "#8f7159",
          700: "#775d4b",
          800: "#624d40",
          900: "#4a3a2f", // Dark brown
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
