import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RingType } from '../types/game';

interface LongPressTargetProps {
  onLongPress: () => void;
  duration?: number; // milliseconds
  disabled?: boolean;
  currentRing: RingType;
}

export function LongPressTarget({
  onLongPress,
  duration = 500,
  disabled = false,
  currentRing,
}: LongPressTargetProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min(elapsed / duration, 1);
    setProgress(newProgress);

    if (newProgress < 1) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      onLongPress();
      setIsPressing(false);
      setProgress(0);
    }
  }, [duration, onLongPress]);

  const handlePointerDown = useCallback(() => {
    if (disabled) return;

    setIsPressing(true);
    startTimeRef.current = Date.now();
    updateProgress();
  }, [disabled, updateProgress]);

  const handlePointerUp = useCallback(() => {
    setIsPressing(false);
    setProgress(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Create a wedge shape that covers all three rings at 12 o'clock
  // Wedge extends from center (200, 200) to outer edge of decade ring
  // Angle: ±20 degrees from 12 o'clock
  const centerX = 200;
  const centerY = 200;
  const outerRadius = 220; // Beyond the outer ring (radius 180 + strokeWidth 40)
  const wedgeAngle = 20; // degrees on each side of 12 o'clock

  // Calculate wedge path coordinates
  const startAngle = -90 - wedgeAngle; // -110 degrees
  const endAngle = -90 + wedgeAngle; // -70 degrees

  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const startX = centerX + outerRadius * Math.cos(startAngleRad);
  const startY = centerY + outerRadius * Math.sin(startAngleRad);
  const endX = centerX + outerRadius * Math.cos(endAngleRad);
  const endY = centerY + outerRadius * Math.sin(endAngleRad);

  const wedgePath = [
    `M ${centerX} ${centerY}`, // Start at center
    `L ${startX} ${startY}`, // Line to start of arc
    `A ${outerRadius} ${outerRadius} 0 0 1 ${endX} ${endY}`, // Arc
    'Z', // Close path back to center
  ].join(' ');

  // Get the radius and stroke width for the current ring's progress indicator
  const ringRadius =
    currentRing === 'decade' ? 180 : currentRing === 'year' ? 130 : 80;
  const strokeWidth = 40;

  // Calculate the full circumference for a complete circle animation
  const fullCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = fullCircumference * (1 - progress);

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        touchAction: 'none',
      }}
    >
      {/* Wedge-shaped hit area covering all rings at 12 o'clock */}
      <path d={wedgePath} fill="transparent" pointerEvents="all" opacity={0} />

      {/* Progress arc on the current ring - full circle animation */}
      {isPressing && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeDasharray={fullCircumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          opacity={0.6}
          transform={`rotate(-90 ${centerX} ${centerY})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
        />
      )}
    </g>
  );
}
