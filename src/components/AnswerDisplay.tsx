import { DIAL_DIMENSIONS } from '../config/dialDimensions';

interface AnswerDisplayProps {
  year: string;
  month: string;
  radioStation: string;
}

export function AnswerDisplay({
  year,
  month,
  radioStation,
}: AnswerDisplayProps) {
  // Parse the year to get day number
  const dayNumber = '31'; // For "31 Aug 1995"

  // Format: "31 Aug 1995"
  const dateString = `${dayNumber} ${month} ${year}`;

  const centerX = DIAL_DIMENSIONS.viewBox.centerX;
  const centerY = DIAL_DIMENSIONS.viewBox.centerY;
  const radius = DIAL_DIMENSIONS.centerCircle.radius;
  const textLineSpacing = DIAL_DIMENSIONS.centerCircle.textLineSpacing;

  return (
    <g>
      {/* Background circle - using ring border color (#1e293b = slate-800) */}
      <circle cx={centerX} cy={centerY} r={radius} fill="#1e293b" />

      {/* Date text - first line */}
      <text
        x={centerX}
        y={centerY - textLineSpacing}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-semibold select-none"
        style={{
          fontSize: '14px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          fill: '#f1f5f9', // slate-100 for light text
        }}
      >
        {dateString}
      </text>

      {/* Radio station text - second line */}
      <text
        x={centerX}
        y={centerY + textLineSpacing}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-semibold select-none"
        style={{
          fontSize: '14px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          fill: '#f1f5f9', // slate-100 for light text
        }}
      >
        {radioStation}
      </text>
    </g>
  );
}
