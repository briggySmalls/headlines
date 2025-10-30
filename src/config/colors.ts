/**
 * Centralized color palette for the Headlines app
 *
 * All colors are based on Tailwind's slate color scale.
 * Using semantic names based on usage rather than color names
 * to make the design system more maintainable.
 */

export const COLORS = {
  // Background colors
  background: {
    dark: '#1e293b',      // slate-800 - primary dark backgrounds (play button, answer display, ring borders)
    disabled: '#94a3b8',  // slate-400 - disabled states (inactive rings, disabled buttons, clock wipe bg)
  },

  // Text and foreground colors
  text: {
    light: '#f1f5f9',     // slate-100 - light text on dark backgrounds
    disabled: '#64748b',  // slate-500 - disabled text and clock wipe fill
  },

  // Status and feedback colors
  status: {
    error: '#ef4444',     // red-500 - error states, incorrect guess flashes
  },
} as const;

// Type helper for extracting color values
export type ColorValue = typeof COLORS[keyof typeof COLORS][keyof typeof COLORS[keyof typeof COLORS]];
