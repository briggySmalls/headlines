import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface LongPressTargetProps {
  onLongPress: () => void;
  duration?: number; // milliseconds
  disabled?: boolean;
}

export function LongPressTarget({
  onLongPress,
  duration = 500,
  disabled = false,
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

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

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
      {/* Invisible hit area */}
      <rect
        x="175"
        y="10"
        width="50"
        height="50"
        fill="transparent"
        pointerEvents="all"
      />

      {/* Progress ring */}
      {isPressing && (
        <motion.circle
          cx="200"
          cy="35"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 200 35)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Visual indicator circle */}
      <circle
        cx="200"
        cy="35"
        r="15"
        fill={isPressing ? '#10b981' : '#cbd5e1'}
        opacity={isPressing ? 0.3 : 0.2}
      />
    </g>
  );
}
