import { describe, it, expect } from 'vitest';
import { calculateRotationToAlignAnswer } from './ringRotation';
import { RingType } from '../types/game';

describe('calculateRotationToAlignAnswer', () => {
  describe('Decade ring', () => {
    it('should return -0 for first decade (1940s)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Decade,
        '1940s',
        '1940s'
      );
      expect(rotation).toBe(-0);
    });

    it('should return -40 for second decade (1950s)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Decade,
        '1950s',
        '1950s'
      );
      // 9 decades total, anglePerSegment = 360/9 = 40°
      // Index 1, rotation = -(1 * 40) = -40°
      expect(rotation).toBe(-40);
    });

    it('should return -200 for 1990s (index 5)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Decade,
        '1990s',
        '1990s'
      );
      // Index 5, rotation = -(5 * 40) = -200°
      expect(rotation).toBe(-200);
    });

    it('should return 0 for non-existent decade', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Decade,
        '2030s',
        '2030s'
      );
      expect(rotation).toBe(0);
    });
  });

  describe('Year ring', () => {
    it('should return -0 for first year of decade', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Year,
        '1990',
        '1990s'
      );
      expect(rotation).toBe(-0);
    });

    it('should return -36 for second year of decade', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Year,
        '1991',
        '1990s'
      );
      // 10 years total, anglePerSegment = 360/10 = 36°
      // Index 1, rotation = -(1 * 36) = -36°
      expect(rotation).toBe(-36);
    });

    it('should return -180 for 1995 (index 5)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Year,
        '1995',
        '1990s'
      );
      // Index 5, rotation = -(5 * 36) = -180°
      expect(rotation).toBe(-180);
    });

    it('should calculate correctly for different decades', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Year,
        '1985',
        '1980s'
      );
      // Index 5 in 1980s, rotation = -(5 * 36) = -180°
      expect(rotation).toBe(-180);
    });

    it('should return 0 for non-existent year', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Year,
        '2000',
        '1990s'
      );
      // 2000 is not in 1990s (1990-1999)
      expect(rotation).toBe(0);
    });
  });

  describe('Month ring', () => {
    it('should return -0 for January (first month)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Jan',
        '1990s'
      );
      expect(rotation).toBe(-0);
    });

    it('should return -30 for February (second month)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Feb',
        '1990s'
      );
      // 12 months total, anglePerSegment = 360/12 = 30°
      // Index 1, rotation = -(1 * 30) = -30°
      expect(rotation).toBe(-30);
    });

    it('should return -210 for August (index 7)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Aug',
        '1990s'
      );
      // Index 7, rotation = -(7 * 30) = -210°
      expect(rotation).toBe(-210);
    });

    it('should return -330 for December (last month)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Dec',
        '1990s'
      );
      // Index 11, rotation = -(11 * 30) = -330°
      expect(rotation).toBe(-330);
    });

    it('should return 0 for non-existent month', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'InvalidMonth',
        '1990s'
      );
      expect(rotation).toBe(0);
    });
  });
});
