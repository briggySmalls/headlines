import { Ring } from './Ring';
import { AnswerMarker } from './AnswerMarker';
import { useGame } from '../hooks/useGame';
import { ringConfig } from '../data/ringConfig';

export function DialInterface() {
  const { state } = useGame();

  // Get current values for each ring
  const decadeValue = state.ringStates.decade.selectedValue;
  const yearsForDecade = ringConfig.getYearsForDecade(decadeValue);

  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring - Decade */}
        <Ring
          ringType="decade"
          segments={ringConfig.decades}
          radius={180}
          strokeWidth={40}
          rotation={state.ringStates.decade.rotationAngle}
          isLocked={state.ringStates.decade.isLocked}
          color={state.ringStates.decade.color}
          isBlurred={false}
        />

        {/* Middle Ring - Year */}
        <Ring
          ringType="year"
          segments={yearsForDecade}
          radius={130}
          strokeWidth={40}
          rotation={state.ringStates.year.rotationAngle}
          isLocked={state.ringStates.year.isLocked}
          color={state.ringStates.year.color}
          isBlurred={!state.ringStates.decade.isLocked}
        />

        {/* Inner Ring - Month */}
        <Ring
          ringType="month"
          segments={ringConfig.months}
          radius={80}
          strokeWidth={40}
          rotation={state.ringStates.month.rotationAngle}
          isLocked={state.ringStates.month.isLocked}
          color={state.ringStates.month.color}
          isBlurred={!state.ringStates.year.isLocked}
        />

        {/* Answer Marker at 12 o'clock */}
        <AnswerMarker />

        {/* Center Play Button Circle */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill="white"
          stroke="#334155"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
