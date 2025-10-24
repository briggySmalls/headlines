interface AnswerDisplayProps {
  decade: string;
  year: string;
  month: string;
}

export function AnswerDisplay({ decade, year, month }: AnswerDisplayProps) {
  return (
    <g>
      {/* Background circle */}
      <circle
        cx="200"
        cy="200"
        r="30"
        fill="white"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Answer text */}
      <text
        x="200"
        y="195"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-slate-800 select-none"
        style={{
          fontSize: '10px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {decade}
      </text>
      <text
        x="200"
        y="203"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-slate-800 select-none"
        style={{
          fontSize: '10px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {year}
      </text>
      <text
        x="200"
        y="211"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-slate-800 select-none"
        style={{
          fontSize: '10px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {month}
      </text>
    </g>
  );
}
