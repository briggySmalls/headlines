import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ring } from './Ring';
import { RingType, RingColor } from '../types/game';
import { useRingRotation } from '../hooks/useRingRotation';
import { useGame } from '../hooks/useGame';

interface InteractiveRingProps {
  ringType: RingType;
  segments: string[];
  radius: number;
  strokeWidth: number;
  rotation: number;
  isLocked: boolean;
  color: RingColor;
  isBlurred: boolean;
}

export function InteractiveRing({
  ringType,
  segments,
  radius,
  strokeWidth,
  rotation,
  isLocked,
  color,
  isBlurred,
}: InteractiveRingProps) {
  const { dispatch, state } = useGame();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const startAngleRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(rotation);
  const [isDragging, setIsDragging] = useState(false);

  const { handleDragStart, handleDrag, handleDragEnd } = useRingRotation({
    ringType,
    segmentCount: segments.length,
  });

  // Update current rotation when prop changes
  useEffect(() => {
    currentRotationRef.current = rotation;
  }, [rotation]);

  // Get SVG reference from parent
  useEffect(() => {
    const svg = document.querySelector('svg');
    if (svg) {
      svgRef.current = svg as SVGSVGElement;
    }
  }, []);

  const getCenterPoint = () => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked || state.currentRing !== ringType) return;

    e.stopPropagation();
    const center = getCenterPoint();
    const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    startAngleRef.current =
      (angle * 180) / Math.PI - currentRotationRef.current;

    console.log(
      `[${ringType}] Drag start - rotation: ${currentRotationRef.current}°`
    );

    handleDragStart();
    setIsDragging(true);

    // Capture pointer for smooth dragging
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isLocked) return;

    e.stopPropagation();
    const center = getCenterPoint();
    const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
    const angleDegrees = (angle * 180) / Math.PI;
    const newRotation = angleDegrees - startAngleRef.current;

    handleDrag(newRotation);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isLocked) return;

    e.stopPropagation();
    setIsDragging(false);

    const segmentIndex = handleDragEnd(currentRotationRef.current);

    if (segmentIndex !== undefined) {
      const selectedValue = segments[segmentIndex];
      if (selectedValue) {
        console.log(
          `[${ringType}] Drag end - selected: ${selectedValue} (segment ${segmentIndex})`
        );
        dispatch({
          type: 'SET_RING_VALUE',
          ringType,
          value: selectedValue,
        });
      }
    }

    // Release pointer capture
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
  };

  const centerX = 200;
  const centerY = 200;
  const isCurrentRing = state.currentRing === ringType;

  return (
    <motion.g
      animate={{
        rotate: rotation,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <Ring
        ringType={ringType}
        segments={segments}
        radius={radius}
        strokeWidth={strokeWidth}
        rotation={0} // Rotation is handled by motion.g
        isLocked={isLocked}
        color={color}
        isBlurred={isBlurred}
      />

      {/* Annular hit area for pointer events - MUST be rendered AFTER Ring so it's on top */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="transparent"
        stroke="transparent"
        strokeWidth={strokeWidth}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor:
            isLocked || !isCurrentRing
              ? 'default'
              : isDragging
                ? 'grabbing'
                : 'grab',
          touchAction: 'none',
        }}
        pointerEvents={isCurrentRing && !isLocked ? 'all' : 'none'}
      />
    </motion.g>
  );
}
