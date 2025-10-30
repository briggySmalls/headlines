import { RingType } from '../types/game';
import { ringConfig } from '../data/ringConfig';

/**
 * Calculates the rotation angle needed to align a specific answer at 12 o'clock
 * @param ringType - The type of ring (decade, year, or month)
 * @param correctAnswer - The correct answer value to align
 * @param correctDecade - The correct decade (needed for year ring to get correct segments)
 * @returns Rotation angle in degrees (negative for clockwise rotation)
 */
export function calculateRotationToAlignAnswer(
  ringType: RingType,
  correctAnswer: string,
  correctDecade: string
): number {
  const segments =
    ringType === RingType.Decade
      ? ringConfig.decades
      : ringType === RingType.Year
        ? ringConfig.getYearsForDecade(correctDecade)
        : ringConfig.months;

  const answerIndex = segments.indexOf(correctAnswer);
  if (answerIndex === -1) return 0;

  const anglePerSegment = 360 / segments.length;
  // Calculate rotation needed to move this segment to 12 o'clock
  // Segments are offset by half a segment, and we rotate clockwise (negative)
  return -(answerIndex * anglePerSegment);
}

/**
 * Determines which segment is currently at the top (12 o'clock position)
 * @param rotation - Current rotation angle in degrees
 * @param segmentCount - Total number of segments on the ring
 * @returns Index of the segment at 12 o'clock (0-based)
 */
export function getSegmentAtTop(rotation: number, segmentCount: number): number {
  const anglePerSegment = 360 / segmentCount;
  // Invert rotation because clockwise rotation (positive) moves higher-indexed segments to the top
  // Also account for the half-segment offset we use to center segments at 12 o'clock
  const adjustedRotation = -rotation + anglePerSegment / 2;
  const normalizedRotation = ((adjustedRotation % 360) + 360) % 360;
  const segmentIndex = Math.floor(normalizedRotation / anglePerSegment);
  return segmentIndex % segmentCount;
}

/**
 * Snaps a rotation angle to the nearest segment boundary
 * @param rotation - Current rotation angle in degrees
 * @param segmentCount - Total number of segments on the ring
 * @returns Snapped rotation angle (preserves rotations beyond ±360°)
 */
export function snapToSegment(rotation: number, segmentCount: number): number {
  const anglePerSegment = 360 / segmentCount;
  // Find the nearest segment without normalizing to 0-360
  // This preserves rotations beyond ±360 degrees
  const nearestSegment = Math.round(rotation / anglePerSegment);
  return nearestSegment * anglePerSegment;
}

/**
 * Calculates the rotation angle needed to display a selected value at 12 o'clock
 * This is the primary function for deriving rotation from selectedValue (single source of truth)
 * @param ringType - The type of ring (decade, year, or month)
 * @param selectedValue - The currently selected value to display at 12 o'clock
 * @param currentDecade - The current decade (needed for year ring to get correct segments)
 * @returns Rotation angle in degrees (negative for clockwise rotation)
 */
export function calculateRotationFromValue(
  ringType: RingType,
  selectedValue: string,
  currentDecade?: string
): number {
  // For year ring, we need the decade to determine segments
  const decadeParam = ringType === RingType.Year && currentDecade ? currentDecade : '';
  return calculateRotationToAlignAnswer(ringType, selectedValue, decadeParam);
}
