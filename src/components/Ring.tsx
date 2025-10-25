import { RingType, RingColor } from '../types/game';
import { motion } from 'framer-motion';
import { DIAL_DIMENSIONS } from '../config/dialDimensions';

interface RingProps {
  ringType: RingType;
  segments: string[];
  radius: number;
  strokeWidth: number;
  rotation: number;
  isLocked: boolean;
  color: RingColor;
  isBlurred: boolean;
  showIncorrectFlash: boolean;
  incorrectGuesses: string[];
  onFlashComplete?: () => void;
}

export function Ring({
  ringType,
  segments,
  radius,
  strokeWidth,
  rotation,
  isLocked,
  color,
  isBlurred,
  showIncorrectFlash,
  incorrectGuesses,
  onFlashComplete,
}: RingProps) {
  const centerX = DIAL_DIMENSIONS.viewBox.centerX;
  const centerY = DIAL_DIMENSIONS.viewBox.centerY;
  const segmentCount = segments.length;
  const anglePerSegment = 360 / segmentCount;

  // Calculate text radius (middle of the ring)
  const textRadius = radius;

  // Get ring color
  const baseRingColor = getRingColor(color, isLocked);
  const flashColor = '#ef4444'; // red-500

  // Unique filter ID for this ring instance
  const filterId = `blur-${ringType}`;

  return (
    <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
      {/* SVG blur filter definition - Safari compatible */}
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={isBlurred ? 8 : 0} />
        </filter>
      </defs>

      {/* Ring segments */}
      {segments.map((segment, index) => {
        // Offset by half a segment so the center of segment 0 is at 12 o'clock
        const startAngle = index * anglePerSegment - 90 - anglePerSegment / 2;
        const endAngle = startAngle + anglePerSegment;

        // Check if this segment was guessed incorrectly
        const isIncorrect = incorrectGuesses.includes(segment);
        const segmentColor = isIncorrect ? darkenColor(baseRingColor) : baseRingColor;

        return (
          <g key={`${segment}-${index}`}>
            {/* Segment arc path with flash animation */}
            <motion.path
              d={describeArc(
                centerX,
                centerY,
                radius,
                startAngle,
                endAngle,
                strokeWidth
              )}
              fill={segmentColor}
              stroke="#1e293b"
              strokeWidth="1"
              animate={{
                fill: showIncorrectFlash
                  ? [segmentColor, flashColor, segmentColor]
                  : segmentColor,
              }}
              transition={
                showIncorrectFlash
                  ? {
                      duration: 0.4,
                      times: [0, 0.5, 1],
                      ease: 'easeInOut',
                    }
                  : {
                      duration: 0.3,
                      ease: 'easeInOut',
                    }
              }
              onAnimationComplete={() => {
                if (showIncorrectFlash && onFlashComplete) {
                  onFlashComplete();
                }
              }}
            />

            {/* Segment text */}
            <g
              transform={`rotate(${
                startAngle + anglePerSegment / 2 + 90
              } ${centerX} ${centerY})`}
            >
              <text
                x={centerX}
                y={centerY - textRadius}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-slate-800 select-none"
                style={{
                  fontSize: '14px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  filter: `url(#${filterId})`,
                  transition: 'filter 0.3s ease-in-out',
                }}
              >
                {segment}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  strokeWidth: number
): string {
  const innerRadius = radius - strokeWidth / 2;
  const outerRadius = radius + strokeWidth / 2;

  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const innerStartX = x + innerRadius * Math.cos(startAngleRad);
  const innerStartY = y + innerRadius * Math.sin(startAngleRad);
  const innerEndX = x + innerRadius * Math.cos(endAngleRad);
  const innerEndY = y + innerRadius * Math.sin(endAngleRad);

  const outerStartX = x + outerRadius * Math.cos(startAngleRad);
  const outerStartY = y + outerRadius * Math.sin(startAngleRad);
  const outerEndX = x + outerRadius * Math.cos(endAngleRad);
  const outerEndY = y + outerRadius * Math.sin(endAngleRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
    'Z',
  ].join(' ');
}

function getRingColor(color: RingColor, isLocked: boolean): string {
  if (!isLocked) {
    return '#94a3b8'; // slate-400
  }

  switch (color) {
    case 'gold':
      return '#FFD700';
    case 'silver':
      return '#C0C0C0';
    case 'bronze':
      return '#CD7F32';
    default:
      return '#94a3b8';
  }
}

function darkenColor(hex: string): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Darken by reducing brightness by 40%
  const darkenFactor = 0.6;
  const newR = Math.round(r * darkenFactor);
  const newG = Math.round(g * darkenFactor);
  const newB = Math.round(b * darkenFactor);

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
