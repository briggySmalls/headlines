import { RingType, RingColor } from '../types/game';
import { clsx } from 'clsx';

interface RingProps {
  ringType: RingType;
  segments: string[];
  radius: number;
  strokeWidth: number;
  rotation: number;
  isLocked: boolean;
  color: RingColor;
  isBlurred: boolean;
}

export function Ring({
  segments,
  radius,
  strokeWidth,
  rotation,
  isLocked,
  color,
  isBlurred,
}: RingProps) {
  const centerX = 200;
  const centerY = 200;
  const segmentCount = segments.length;
  const anglePerSegment = 360 / segmentCount;

  // Calculate text radius (middle of the ring)
  const textRadius = radius;

  // Get ring color
  const ringColor = getRingColor(color, isLocked);

  return (
    <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
      {/* Ring segments */}
      {segments.map((segment, index) => {
        const startAngle = index * anglePerSegment - 90; // -90 to start at top
        const endAngle = startAngle + anglePerSegment;

        return (
          <g key={`${segment}-${index}`}>
            {/* Segment arc path */}
            <path
              d={describeArc(
                centerX,
                centerY,
                radius,
                startAngle,
                endAngle,
                strokeWidth
              )}
              fill={ringColor}
              stroke="#1e293b"
              strokeWidth="1"
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
                className={clsx(
                  'text-xs font-semibold fill-slate-800',
                  isBlurred && 'blur-[8px]'
                )}
                style={{
                  fontSize: '14px',
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
