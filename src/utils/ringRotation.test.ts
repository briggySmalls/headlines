import { describe, it, expect } from 'vitest';
import { calculateRotationToAlignAnswer, getSegmentAtTop, snapToSegment } from './ringRotation';
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

describe('getSegmentAtTop', () => {
  it('should return segment 0 at rotation 0', () => {
    const segment = getSegmentAtTop(0, 12);
    expect(segment).toBe(0);
  });

  it('should return segment 1 after rotating one segment clockwise', () => {
    // 12 segments, anglePerSegment = 30°
    // Rotating -30° (clockwise) should move segment 1 to top
    const segment = getSegmentAtTop(-30, 12);
    expect(segment).toBe(1);
  });

  it('should return segment 11 after rotating one segment counter-clockwise', () => {
    // Rotating 30° (counter-clockwise) should move segment 11 to top
    const segment = getSegmentAtTop(30, 12);
    expect(segment).toBe(11);
  });

  it('should handle full rotation (360° = 0°)', () => {
    const segment360 = getSegmentAtTop(360, 12);
    const segment0 = getSegmentAtTop(0, 12);
    expect(segment360).toBe(segment0);
  });

  it('should handle negative full rotation (-360° = 0°)', () => {
    const segmentNeg360 = getSegmentAtTop(-360, 12);
    const segment0 = getSegmentAtTop(0, 12);
    expect(segmentNeg360).toBe(segment0);
  });

  it('should handle multi-rotation (720° = 0°)', () => {
    const segment = getSegmentAtTop(720, 12);
    expect(segment).toBe(0);
  });

  it('should work with 9 segments (decades)', () => {
    // 9 segments, anglePerSegment = 40°
    const segment = getSegmentAtTop(-40, 9);
    expect(segment).toBe(1);
  });

  it('should work with 10 segments (years)', () => {
    // 10 segments, anglePerSegment = 36°
    const segment = getSegmentAtTop(-72, 10);
    expect(segment).toBe(2);
  });

  it('should handle large negative rotations', () => {
    // -390° = -360° - 30° = one full rotation + one segment clockwise
    const segment = getSegmentAtTop(-390, 12);
    expect(segment).toBe(1);
  });

  it('should handle large positive rotations', () => {
    // 390° = 360° + 30° = one full rotation + one segment counter-clockwise
    const segment = getSegmentAtTop(390, 12);
    expect(segment).toBe(11);
  });
});

describe('snapToSegment', () => {
  it('should snap 0 to 0', () => {
    const snapped = snapToSegment(0, 12);
    expect(snapped).toBe(0);
  });

  it('should snap to nearest segment', () => {
    // 12 segments, anglePerSegment = 30°
    // 35° should snap to 30°
    const snapped = snapToSegment(35, 12);
    expect(snapped).toBe(30);
  });

  it('should snap down when closer to lower segment', () => {
    // 32° should snap to 30° (closer than 60°)
    const snapped = snapToSegment(32, 12);
    expect(snapped).toBe(30);
  });

  it('should snap up when exactly between segments', () => {
    // 45° is exactly between 30° and 60°, should round up to 60°
    const snapped = snapToSegment(45, 12);
    expect(snapped).toBe(60);
  });

  it('should preserve negative rotations', () => {
    // -35° should snap to -30°
    const snapped = snapToSegment(-35, 12);
    expect(snapped).toBe(-30);
  });

  it('should preserve rotations beyond 360°', () => {
    // 395° should snap to 390° (not normalize to 30°)
    const snapped = snapToSegment(395, 12);
    expect(snapped).toBe(390);
  });

  it('should preserve rotations beyond -360°', () => {
    // -395° should snap to -390° (not normalize to -30°)
    const snapped = snapToSegment(-395, 12);
    expect(snapped).toBe(-390);
  });

  it('should work with 9 segments (decades)', () => {
    // 9 segments, anglePerSegment = 40°
    // 50° should snap to 40°
    const snapped = snapToSegment(50, 9);
    expect(snapped).toBe(40);
  });

  it('should work with 10 segments (years)', () => {
    // 10 segments, anglePerSegment = 36°
    // 70° should snap to 72°
    const snapped = snapToSegment(70, 10);
    expect(snapped).toBe(72);
  });

  it('should handle very large rotations', () => {
    // 1000° should snap to nearest 30° multiple = 990°
    const snapped = snapToSegment(1000, 12);
    expect(snapped).toBe(990);
  });
});
