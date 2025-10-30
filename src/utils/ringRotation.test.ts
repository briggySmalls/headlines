import { describe, it, expect } from 'vitest';
import { calculateRotationToAlignAnswer, calculateRotationFromValue, getSegmentAtTop, snapToSegment } from './ringRotation';
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
    it('should return -0 for Jan-Mar (first quarter)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Jan-Mar',
        '1990s'
      );
      expect(rotation).toBe(-0);
    });

    it('should return -90 for Apr-Jun (second quarter)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Apr-Jun',
        '1990s'
      );
      // 4 quarters total, anglePerSegment = 360/4 = 90°
      // Index 1, rotation = -(1 * 90) = -90°
      expect(rotation).toBe(-90);
    });

    it('should return -180 for Jul-Sep (third quarter)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Jul-Sep',
        '1990s'
      );
      // Index 2, rotation = -(2 * 90) = -180°
      expect(rotation).toBe(-180);
    });

    it('should return -270 for Oct-Dec (last quarter)', () => {
      const rotation = calculateRotationToAlignAnswer(
        RingType.Month,
        'Oct-Dec',
        '1990s'
      );
      // Index 3, rotation = -(3 * 90) = -270°
      expect(rotation).toBe(-270);
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

describe('calculateRotationFromValue', () => {
  describe('Decade ring', () => {
    it('should calculate rotation for 1940s (first decade)', () => {
      const rotation = calculateRotationFromValue(RingType.Decade, '1940s');
      expect(rotation).toBe(-0);
    });

    it('should calculate rotation for 1990s', () => {
      const rotation = calculateRotationFromValue(RingType.Decade, '1990s');
      expect(rotation).toBe(-200); // Index 5, -(5 * 40)
    });

    it('should calculate rotation for 2020s (last decade)', () => {
      const rotation = calculateRotationFromValue(RingType.Decade, '2020s');
      expect(rotation).toBe(-320); // Index 8, -(8 * 40)
    });
  });

  describe('Year ring', () => {
    it('should calculate rotation for first year of decade', () => {
      const rotation = calculateRotationFromValue(RingType.Year, '1990', '1990s');
      expect(rotation).toBe(-0);
    });

    it('should calculate rotation for middle year of decade', () => {
      const rotation = calculateRotationFromValue(RingType.Year, '1995', '1990s');
      expect(rotation).toBe(-180); // Index 5, -(5 * 36)
    });

    it('should calculate rotation for last year of decade', () => {
      const rotation = calculateRotationFromValue(RingType.Year, '1999', '1990s');
      expect(rotation).toBe(-324); // Index 9, -(9 * 36)
    });

    it('should work for different decades', () => {
      const rotation = calculateRotationFromValue(RingType.Year, '1985', '1980s');
      expect(rotation).toBe(-180); // Index 5 in 1980s
    });
  });

  describe('Month ring', () => {
    it('should calculate rotation for Jan-Mar (first quarter)', () => {
      const rotation = calculateRotationFromValue(RingType.Month, 'Jan-Mar');
      expect(rotation).toBe(-0);
    });

    it('should calculate rotation for Apr-Jun (second quarter)', () => {
      const rotation = calculateRotationFromValue(RingType.Month, 'Apr-Jun');
      expect(rotation).toBe(-90); // Index 1, -(1 * 90)
    });

    it('should calculate rotation for Jul-Sep (third quarter)', () => {
      const rotation = calculateRotationFromValue(RingType.Month, 'Jul-Sep');
      expect(rotation).toBe(-180); // Index 2, -(2 * 90)
    });

    it('should calculate rotation for Oct-Dec (last quarter)', () => {
      const rotation = calculateRotationFromValue(RingType.Month, 'Oct-Dec');
      expect(rotation).toBe(-270); // Index 3, -(3 * 90)
    });
  });

  describe('Round-trip consistency', () => {
    it('should be consistent: value -> rotation -> segment index (decades)', () => {
      const originalValue = '1990s';
      const rotation = calculateRotationFromValue(RingType.Decade, originalValue);
      const segmentIndex = getSegmentAtTop(rotation, 9);
      expect(segmentIndex).toBe(5); // 1990s is at index 5
    });

    it('should be consistent: value -> rotation -> segment index (years)', () => {
      const originalValue = '1995';
      const rotation = calculateRotationFromValue(RingType.Year, originalValue, '1990s');
      const segmentIndex = getSegmentAtTop(rotation, 10);
      expect(segmentIndex).toBe(5); // 1995 is at index 5 in 1990s
    });

    it('should be consistent: value -> rotation -> segment index (months)', () => {
      const originalValue = 'Jul-Sep';
      const rotation = calculateRotationFromValue(RingType.Month, originalValue);
      const segmentIndex = getSegmentAtTop(rotation, 4);
      expect(segmentIndex).toBe(2); // Jul-Sep is at index 2
    });
  });
});
