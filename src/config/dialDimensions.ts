/**
 * Centralized configuration for dial interface dimensions
 *
 * Design principles:
 * - SVG viewBox: 400x400, center at (200, 200)
 * - Rings touch edge-to-edge (no gaps between rings)
 * - 10px margin between outermost ring and viewport edge
 * - Center circle touches innermost ring
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

  // Ring stroke width (all rings use same width)
  ringStrokeWidth: 48,

  // Ring radii (measured to center line of stroke)
  rings: {
    decade: {
      radius: 166, // Outer edge: 190, Inner edge: 142
    },
    year: {
      radius: 118, // Outer edge: 142, Inner edge: 94
    },
    month: {
      radius: 70, // Outer edge: 94, Inner edge: 46
    },
  },

  // Center circle
  centerCircle: {
    radius: 46, // Touches month ring inner edge at 46
    textLineSpacing: 8, // Vertical spacing between text lines (half-spacing from center)
  },

  // Long press target
  longPressTarget: {
    outerRadius: 220, // Beyond decade ring outer edge (190)
    wedgeAngle: 20, // Degrees on each side of 12 o'clock (40° total)
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
