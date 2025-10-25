import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
  duration?: number; // Audio duration in seconds
}

export function PlayButton({
  isPlaying,
  onClick,
  disabled,
  duration = 10,
}: PlayButtonProps) {
  const radius = 70;
  const centerX = 200;
  const centerY = 200;

  return (
    <g>
      {/* Button background circle - same as answer display */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="#1e293b"
        style={{ cursor: disabled || isPlaying ? 'default' : 'pointer' }}
        onClick={disabled || isPlaying ? undefined : onClick}
      />

      {/* Play/Clock-wipe animation */}
      {isPlaying ? (
        // Clock-wipe animation - circular fill from 12 o'clock
        <ClockWipe
          centerX={centerX}
          centerY={centerY}
          radius={radius}
          duration={duration}
        />
      ) : (
        // Play icon (triangle) - light color
        <motion.path
          d="M 175 165 L 175 235 L 235 200 Z"
          fill="#f1f5f9"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}

// Clock wipe component that creates a growing pie slice
function ClockWipe({
  centerX,
  centerY,
  radius,
  duration,
}: {
  centerX: number;
  centerY: number;
  radius: number;
  duration: number;
}) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const currentAngle = progress * 360;
      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [duration]);

  return (
    <path
      d={createClockWipePath(centerX, centerY, radius, angle)}
      fill="#f1f5f9"
      fillOpacity={0.5}
      style={{ pointerEvents: 'none' }}
    />
  );
}

// Create a pie slice path that grows from 12 o'clock clockwise
function createClockWipePath(
  cx: number,
  cy: number,
  r: number,
  angle: number
): string {
  if (angle === 0) {
    // Just a line from center to top
    return `M ${cx} ${cy} L ${cx} ${cy - r}`;
  }

  // Convert angle to radians (0° = 12 o'clock = -90° in standard coords)
  const startAngle = -90; // 12 o'clock position
  const endAngle = startAngle + angle;

  const endAngleRad = (endAngle * Math.PI) / 180;
  const endX = cx + r * Math.cos(endAngleRad);
  const endY = cy + r * Math.sin(endAngleRad);

  // Use large arc flag when angle > 180
  const largeArcFlag = angle > 180 ? 1 : 0;

  return `
    M ${cx} ${cy}
    L ${cx} ${cy - r}
    A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}
    Z
  `;
}
