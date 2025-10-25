/**
 * Centralized configuration for dial interface dimensions
 *
 * Design principles:
 * - SVG viewBox: 400x400, center at (200, 200)
 * - 10px margin between outermost ring and viewport edge
 * - 10px gap between rings
 * - 10px gap between innermost ring and center circle
 */

export const DIAL_DIMENSIONS = {
  // SVG canvas
  viewBox: {
    width: 400,
    height: 400,
    centerX: 200,
    centerY: 200,
  },

  // Margins
  outerMargin: 10, // Gap between viewport edge and outermost ring
  ringGap: 10, // Gap between rings

  // Ring stroke width (all rings use same width)
  ringStrokeWidth: 40,

  // Ring radii (measured to center line of stroke)
  rings: {
    decade: {
      radius: 170, // Outer edge: 190, Inner edge: 150
    },
    year: {
      radius: 120, // Outer edge: 140, Inner edge: 100
    },
    month: {
      radius: 70, // Outer edge: 90, Inner edge: 50
    },
  },

  // Center circle
  centerCircle: {
    radius: 40, // Gap of 10px from month ring inner edge at 50
    textLineSpacing: 8, // Vertical spacing between text lines (half-spacing from center)
  },
} as const;

// Helper functions
export function getRingRadius(ringType: 'decade' | 'year' | 'month'): number {
  return DIAL_DIMENSIONS.rings[ringType].radius;
}

export function getRingOuterEdge(ringType: 'decade' | 'year' | 'month'): number {
  return DIAL_DIMENSIONS.rings[ringType].radius + DIAL_DIMENSIONS.ringStrokeWidth / 2;
}

export function getRingInnerEdge(ringType: 'decade' | 'year' | 'month'): number {
  return DIAL_DIMENSIONS.rings[ringType].radius - DIAL_DIMENSIONS.ringStrokeWidth / 2;
}
