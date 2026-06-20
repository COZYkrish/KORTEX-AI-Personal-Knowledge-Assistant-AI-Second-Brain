/**
 * Bauhaus Design System — Shared Constants
 * Use these across all components instead of custom CSS classes.
 * This guarantees styles are always applied correctly.
 */

export const B = {
  // ── Colors ──────────────────────────────────────────────────────
  RED:    "#D02020",
  BLUE:   "#1040C0",
  YELLOW: "#F0C020",
  BLACK:  "#121212",
  CANVAS: "#F0F0F0",
  MUTED:  "#E0E0E0",

  // ── Typography helpers ───────────────────────────────────────────
  /** Massive uppercase constructivist headline */
  displayStyle: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    fontWeight: 900,
    textTransform: "uppercase" as const,
    lineHeight: 0.98,
    letterSpacing: "0",
  },
  /** Section label — small uppercase spaced */
  labelStyle: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0",
    fontSize: "0.7rem",
  },
  /** Bold body */
  bodyBoldStyle: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0",
    fontSize: "0.75rem",
  },

  // ── Hard offset shadows ──────────────────────────────────────────
  shadowSm:   "3px 3px 0px 0px #121212",
  shadowMd:   "4px 4px 0px 0px #121212",
  shadowLg:   "8px 8px 0px 0px #121212",
  shadowWhiteMd: "4px 4px 0px 0px #ffffff",
  shadowWhiteLg: "8px 8px 0px 0px #ffffff",

  // ── Borders ──────────────────────────────────────────────────────
  border2: "2px solid #121212",
  border4: "4px solid #121212",
  borderWhite2: "2px solid #ffffff",
  borderWhite4: "4px solid #ffffff",
} as const;

/** Bauhaus Button — Red primary CTA */
export const btnPrimaryClass =
  "inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-bold uppercase text-sm cursor-pointer select-none transition-all duration-150 hover:bg-[#b01a1a] active:translate-x-[2px] active:translate-y-[2px]";
export const btnPrimaryStyle = { boxShadow: "4px 4px 0px 0px #121212" } as const;

/** Bauhaus Button — Blue secondary */
export const btnSecondaryClass =
  "inline-flex items-center justify-center gap-2 bg-[#1040C0] text-white border-2 border-[#121212] font-bold uppercase text-sm cursor-pointer select-none transition-all duration-150 hover:bg-[#0c30a0] active:translate-x-[2px] active:translate-y-[2px]";
export const btnSecondaryStyle = { boxShadow: "4px 4px 0px 0px #121212" } as const;

/** Bauhaus Button — Yellow */
export const btnYellowClass =
  "inline-flex items-center justify-center gap-2 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-bold uppercase text-sm cursor-pointer select-none transition-all duration-150 hover:bg-[#d4a818] active:translate-x-[2px] active:translate-y-[2px]";
export const btnYellowStyle = { boxShadow: "4px 4px 0px 0px #121212" } as const;

/** Bauhaus Button — White outline */
export const btnOutlineClass =
  "inline-flex items-center justify-center gap-2 bg-white text-[#121212] border-2 border-[#121212] font-bold uppercase text-sm cursor-pointer select-none transition-all duration-150 hover:bg-[#e8e8e8] active:translate-x-[2px] active:translate-y-[2px]";
export const btnOutlineStyle = { boxShadow: "4px 4px 0px 0px #121212" } as const;

/** Bauhaus Card */
export const cardClass = "bg-white cursor-pointer transition-transform duration-200 hover:-translate-y-[2px]";
export const cardStyle = { border: "4px solid #121212", boxShadow: "8px 8px 0px 0px #121212" } as const;
