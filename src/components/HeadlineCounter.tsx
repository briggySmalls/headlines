interface HeadlineCounterProps {
  headlinesHeard: number;
  total: number;
}

export function HeadlineCounter({
  headlinesHeard,
  total,
}: HeadlineCounterProps) {
  return (
    <div className="absolute top-4 right-4 text-sm font-semibold text-slate-700">
      {headlinesHeard}/{total}
    </div>
  );
}
