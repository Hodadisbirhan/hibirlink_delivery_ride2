/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "components/**/*.{vue,js,ts}",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "composables/**/*.{js,ts}",
    "plugins/**/*.{js,ts}",
    "App.{js,ts,vue}",
    "app.{js,ts,vue}",
    "Error.{js,ts,vue}",
    "error.{js,ts,vue}",
    "content/**/*.md",
  ],
  darkMode: "class",
  theme: {
    extend: {
      lineClamp: {
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      colors: {
        //blue
        primary: "#477eeb",
        primaryvar1: "#306ee8",
        primaryvar2: "#5e8eed",
        primaryvar3: "#759ef0",
        primaryvar4: "#8caef2",
        primaryvar5: "#a3bef5",
        primaryvar6: "#bacff7",
        primaryvar7: "#d1dffa",
        primaryvar8: "#e8effc",

        // gray
        neutral100: "#404040",
        neutral200: "#525252",
        neutral300: "#737373",
        neutral400: "#a3a3a3",
        neutral500: "#d4d4d4",
        neutral600: "#e5e5e5",

        // dark
        dark100: "#051509",
        dark200: "#262626",
        dark300: "#22292A",

        // light
        light100: "#E3EAFF",
        light150: "#F5F7F7",
        light200: "#F5F5F5",
        light300: "#FAFAFA",
        light400: "#FFFFFF",

        // other
        darkblue: "#000066",
        lemon: "#8DCC7B",
        purple: "#3D00BA",
        orange: "#FFA046",
        red: "#FE6845",
      },

      fontFamily: {
        nunito: ["Nunito", "Roboto", "sans-serif"],
      },

      fontSize: {
        xs: ["0.75rem", "1rem"],
        sm: ["0.875rem", "1.25rem"],
        md: ["0.887rem", "1.37rem"],
        base: ["1rem", "1.5rem"],
        lg: ["1.125rem", "1.75rem"],
        xl: ["1.25rem", "1.75rem"],
      },

      screens: {
        xs: "512px",
        // => @media (min-width: 512px) { ... }
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
        "3xl": "1600px",
        // => @media (min-width: 1600px) { ... }
        "4xl": "1920px",
        // => @media (min-width: 1920px) { ... },
      },

      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        fill: "100vw",
        fit: "115wh",
      },

      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "translate(-6px)" },
          "50%": { transform: "translate(8px)" },
        },
        loader: {
          to: {
            opacity: 0.1,
            transform: "translate3d(0, -1rem, 0)",
          },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
        loader: "loader 0.6s infinite alternate",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
