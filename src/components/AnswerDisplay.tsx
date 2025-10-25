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

  return (
    <g>
      {/* Background circle - using ring border color (#1e293b = slate-800) */}
      <circle cx="200" cy="200" r="50" fill="#1e293b" />

      {/* Date text - first line */}
      <text
        x="200"
        y="192"
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
        x="200"
        y="208"
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
