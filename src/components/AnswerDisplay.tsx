import { DIAL_DIMENSIONS } from '../config/dialDimensions';
import { COLORS } from '../config/colors';

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
      {/* Background circle - using ring border color */}
      <circle cx={centerX} cy={centerY} r={radius} fill={COLORS.background.dark} />

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
          fill: COLORS.text.light,
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
          fill: COLORS.text.light,
        }}
      >
        {radioStation}
      </text>
    </g>
  );
}
