import { RingType, RingColor } from '../types/game';
import { motion } from 'framer-motion';

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
  onFlashComplete?: () => void;
}

export function Ring({
  segments,
  radius,
  strokeWidth,
  rotation,
  isLocked,
  color,
  isBlurred,
  showIncorrectFlash,
  onFlashComplete,
}: RingProps) {
  const centerX = 200;
  const centerY = 200;
  const segmentCount = segments.length;
  const anglePerSegment = 360 / segmentCount;

  // Calculate text radius (middle of the ring)
  const textRadius = radius;

  // Get ring color
  const baseRingColor = getRingColor(color, isLocked);
  const flashColor = '#ef4444'; // red-500

  return (
    <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
      {/* Ring segments */}
      {segments.map((segment, index) => {
        // Offset by half a segment so the center of segment 0 is at 12 o'clock
        const startAngle = index * anglePerSegment - 90 - anglePerSegment / 2;
        const endAngle = startAngle + anglePerSegment;

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
              fill={baseRingColor}
              stroke="#1e293b"
              strokeWidth="1"
              animate={{
                fill: showIncorrectFlash
                  ? [baseRingColor, flashColor, baseRingColor]
                  : baseRingColor,
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
              <motion.text
                x={centerX}
                y={centerY - textRadius}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-slate-800 select-none"
                style={{
                  fontSize: '14px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
                initial={{
                  filter: isBlurred ? 'blur(8px)' : 'blur(0px)',
                }}
                animate={{
                  filter: isBlurred ? 'blur(8px)' : 'blur(0px)',
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                {segment}
              </motion.text>
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
