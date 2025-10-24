export function AnswerMarker() {
  return (
    <g>
      {/* Triangle marker pointing down at 12 o'clock position */}
      <path
        d="M 200 20 L 195 30 L 205 30 Z"
        fill="#10b981"
        stroke="#059669"
        strokeWidth="1"
      />
      {/* Label text */}
      <text
        x="200"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-slate-700"
        style={{ fontSize: '12px' }}
      >
        ANSWER
      </text>
    </g>
  );
}
