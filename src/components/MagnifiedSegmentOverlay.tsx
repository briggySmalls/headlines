import { motion, AnimatePresence } from 'framer-motion';
import { DIAL_DIMENSIONS } from '../config/dialDimensions';
import { RingColor } from '../types/game';
import { getRingColor } from './Ring';

interface MagnifiedSegmentOverlayProps {
  segments: string[];
  selectedValue: string;
  radius: number;
  strokeWidth: number;
  color: RingColor;
  isLocked: boolean;
}

export function MagnifiedSegmentOverlay({
  segments,
  selectedValue,
  radius,
  strokeWidth,
  color,
  isLocked,
}: MagnifiedSegmentOverlayProps) {
  const centerX = DIAL_DIMENSIONS.viewBox.centerX;
  const centerY = DIAL_DIMENSIONS.viewBox.centerY;
  const segmentCount = segments.length;
  const anglePerSegment = 360 / segmentCount;

  // Use selectedValue directly - it's already the value at 12 o'clock
  const topSegmentText = selectedValue;

  // Magnification settings - split equally above and below
  const magnificationOffset = 10; // How much bigger the overlay is (total)
  const overlayRadius = radius; // Keep radius at center
  const overlayStrokeWidth = strokeWidth + magnificationOffset; // Grow stroke, splits equally

  // Calculate arc path for the overlay segment
  // The overlay is always centered at 12 o'clock (top, -90 degrees)
  const startAngle = -90 - anglePerSegment / 2;
  const endAngle = -90 + anglePerSegment / 2;

  const innerRadius = overlayRadius - overlayStrokeWidth / 2;
  const outerRadius = overlayRadius + overlayStrokeWidth / 2;

  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const innerStartX = centerX + innerRadius * Math.cos(startAngleRad);
  const innerStartY = centerY + innerRadius * Math.sin(startAngleRad);
  const innerEndX = centerX + innerRadius * Math.cos(endAngleRad);
  const innerEndY = centerY + innerRadius * Math.sin(endAngleRad);

  const outerStartX = centerX + outerRadius * Math.cos(startAngleRad);
  const outerStartY = centerY + outerRadius * Math.sin(startAngleRad);
  const outerEndX = centerX + outerRadius * Math.cos(endAngleRad);
  const outerEndY = centerY + outerRadius * Math.sin(endAngleRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const arcPath = [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
    'Z',
  ].join(' ');

  // Get the ring color
  const segmentColor = getRingColor(color, isLocked);

  // Text Y position
  const textY = centerY - radius;
  const wipeOffset = 5; // pixels to move up/down for wipe effect

  return (
    <g>
      {/* Overlay segment arc - always at 12 o'clock */}
      <path
        d={arcPath}
        fill={segmentColor}
        stroke="#1e293b"
        strokeWidth="2"
      />

      {/* Animated text overlay - positioned at ring's center radius */}
      <AnimatePresence mode="wait">
        <motion.g
          key={topSegmentText} // Re-mount when text changes
          initial={{ opacity: 0, y: wipeOffset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -wipeOffset }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <text
            x={centerX}
            y={textY} // Use original radius, not overlayRadius, for vertical center
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-800 select-none"
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {topSegmentText}
          </text>
        </motion.g>
      </AnimatePresence>
    </g>
  );
}
