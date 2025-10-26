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
