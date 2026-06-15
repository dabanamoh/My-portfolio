/* =========================================================================
   BRAND CONFIG  —  edit your colours, fonts and spacing here, ONCE.
   Every page loads this file, so a change here updates the whole site.
   (This drives Tailwind, the styling engine the site uses.)
   ========================================================================= */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* --- main brand accents (change these two to re-skin the site) --- */
        primary: "#4648d4",            // indigo — buttons, links, highlights
        "primary-container": "#6063ee",
        tertiary: "#735c00",           // gold accent (used sparingly)

        /* --- text --- */
        "on-surface": "#0b1c30",       // main heading/body text
        "on-surface-variant": "#464554",
        "on-background": "#0b1c30",
        secondary: "#565e74",          // muted/sub text
        "on-primary": "#ffffff",       // text on indigo
        "on-primary-container": "#fffbff",

        /* --- backgrounds / surfaces --- */
        background: "#f8f9ff",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-variant": "#d3e4fe",
        "surface-tint": "#494bd6",

        /* --- lines & misc --- */
        outline: "#767586",
        "outline-variant": "#c7c4d7",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#c0c1ff",

        /* --- fixed tonal set (kept from the original design) --- */
        "primary-fixed": "#e1e0ff",
        "primary-fixed-dim": "#c0c1ff",
        "on-primary-fixed": "#07006c",
        "on-primary-fixed-variant": "#2f2ebe",
        "secondary-container": "#dae2fd",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5c647a",
        "secondary-fixed": "#dae2fd",
        "secondary-fixed-dim": "#bec6e0",
        "on-secondary-fixed": "#131b2e",
        "on-secondary-fixed-variant": "#3f465c",
        "tertiary-container": "#cea700",
        "tertiary-fixed": "#ffe084",
        "tertiary-fixed-dim": "#efc200",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#4e3e00",
        "on-tertiary-fixed": "#231b00",
        "on-tertiary-fixed-variant": "#574500",

        /* --- status --- */
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        "container-max": "1280px",
        "stack-unit": "8px",
        gutter: "24px"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans"], "display-lg": ["Plus Jakarta Sans"], "display-lg-mobile": ["Plus Jakarta Sans"],
        headline: ["Plus Jakarta Sans"], "headline-lg": ["Plus Jakarta Sans"], "headline-lg-mobile": ["Plus Jakarta Sans"], "headline-md": ["Plus Jakarta Sans"],
        body: ["Plus Jakarta Sans"], "body-lg": ["Plus Jakarta Sans"], "body-md": ["Plus Jakarta Sans"],
        label: ["Plus Jakarta Sans"], "label-md": ["Plus Jakarta Sans"], caption: ["Plus Jakarta Sans"]
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["36px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", letterSpacing: "0px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0px", fontWeight: "500" }]
      }
    }
  }
};
