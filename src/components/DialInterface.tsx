import { useState, useRef, useCallback } from 'react';
import { Ring } from './Ring';
import { PlayButton } from './PlayButton';
import { AnswerDisplay } from './AnswerDisplay';
import { useGame } from '../hooks/useGame';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { ringConfig } from '../data/ringConfig';
import { motion } from 'framer-motion';
import { RingType } from '../types/game';
import { DIAL_DIMENSIONS, getRingRadius } from '../config/dialDimensions';

export function DialInterface() {
  const { state, dispatch } = useGame();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);

  // Get current values for each ring
  const decadeValue = state.ringStates.decade.selectedValue;
  const yearsForDecade = ringConfig.getYearsForDecade(decadeValue);

  // Audio player for current headline
  const currentAudioSrc =
    state.audioFiles[state.currentHeadlineIndex] || state.audioFiles[0];
  const { play, isPlaying, duration } = useAudioPlayer(currentAudioSrc);

  const getCenterPoint = useCallback(() => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const getSegmentAtTop = useCallback(
    (rotation: number, segmentCount: number) => {
      const anglePerSegment = 360 / segmentCount;
      // Invert rotation because clockwise rotation (positive) moves higher-indexed segments to the top
      // Also account for the half-segment offset we use to center segments at 12 o'clock
      const adjustedRotation = -rotation + anglePerSegment / 2;
      const normalizedRotation = ((adjustedRotation % 360) + 360) % 360;
      const segmentIndex = Math.floor(normalizedRotation / anglePerSegment);
      return segmentIndex % segmentCount;
    },
    []
  );

  const snapToSegment = useCallback(
    (rotation: number, segmentCount: number) => {
      const anglePerSegment = 360 / segmentCount;
      // Find the nearest segment without normalizing to 0-360
      // This preserves rotations beyond ±360 degrees
      const nearestSegment = Math.round(rotation / anglePerSegment);
      return nearestSegment * anglePerSegment;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const currentRing = state.currentRing;
      if (state.ringStates[currentRing].isLocked) return;

      const center = getCenterPoint();
      const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
      const currentRotation = state.ringStates[currentRing].rotationAngle;

      startAngleRef.current = (angle * 180) / Math.PI - currentRotation;
      currentRotationRef.current = currentRotation;
      setIsDragging(true);
      e.stopPropagation();
    },
    [state, getCenterPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isDragging) return;

      const currentRing = state.currentRing;
      if (state.ringStates[currentRing].isLocked) return;

      const center = getCenterPoint();
      const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
      const angleDegrees = (angle * 180) / Math.PI;

      // Calculate the new rotation
      let newRotation = angleDegrees - startAngleRef.current;

      // Handle discontinuity at -180/+180 boundary
      // Find the smallest angular difference from current rotation
      const currentRotation = currentRotationRef.current;
      const diff = newRotation - currentRotation;

      // If difference is > 180°, we crossed the boundary
      if (diff > 180) {
        newRotation -= 360;
      } else if (diff < -180) {
        newRotation += 360;
      }

      // Update the reference for next iteration
      currentRotationRef.current = newRotation;

      dispatch({
        type: 'ROTATE_RING',
        ringType: currentRing,
        angle: newRotation,
      });
    },
    [isDragging, state, getCenterPoint, dispatch]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;

    const currentRing = state.currentRing;
    const currentRotation = state.ringStates[currentRing].rotationAngle;
    const segments =
      currentRing === 'decade'
        ? ringConfig.decades
        : currentRing === 'year'
          ? yearsForDecade
          : ringConfig.months;
    const segmentCount = segments.length;

    // Snap to nearest segment
    const snappedRotation = snapToSegment(currentRotation, segmentCount);
    dispatch({
      type: 'ROTATE_RING',
      ringType: currentRing,
      angle: snappedRotation,
    });

    // Update selected value
    const segmentIndex = getSegmentAtTop(snappedRotation, segmentCount);
    const selectedValue = segments[segmentIndex];

    if (selectedValue) {
      dispatch({
        type: 'SET_RING_VALUE',
        ringType: currentRing,
        value: selectedValue,
      });
    }

    setIsDragging(false);
  }, [
    isDragging,
    state,
    yearsForDecade,
    snapToSegment,
    getSegmentAtTop,
    dispatch,
  ]);

  const handleSubmitGuess = () => {
    const currentRing = state.currentRing;
    const guessedValue = state.ringStates[currentRing].selectedValue;
    const correctValue = state.correctAnswer[currentRing];

    // Don't allow submitting if this value was already guessed incorrectly
    if (state.ringStates[currentRing].incorrectGuesses.includes(guessedValue)) {
      return;
    }

    const isCorrect = guessedValue === correctValue;

    dispatch({
      type: 'SUBMIT_GUESS',
      ringType: currentRing,
      guessedValue,
      isCorrect,
    });
  };

  const handleFlashComplete = useCallback(
    (ringType: RingType) => {
      dispatch({
        type: 'CLEAR_INCORRECT_FLASH',
        ringType,
      });
    },
    [dispatch]
  );

  // Get ring dimensions for hit area
  const getRingDimensions = (ringType: RingType) => {
    return {
      radius: getRingRadius(ringType),
      strokeWidth: DIAL_DIMENSIONS.ringStrokeWidth,
    };
  };

  const handlePlayClick = useCallback(() => {
    // Disable clicking during playback
    if (isPlaying) {
      return;
    }

    // First time playing this headline - increment headlinesHeard
    if (state.headlinesHeard === state.currentHeadlineIndex) {
      dispatch({ type: 'PLAY_HEADLINE' });
    }

    play();
  }, [isPlaying, play, state.headlinesHeard, state.currentHeadlineIndex, dispatch]);

  return (
    <div className="relative w-full max-w-md touch-none select-none flex flex-col items-center" style={{ gap: '2rem' }}>
      <div className="w-full aspect-square">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${DIAL_DIMENSIONS.viewBox.width} ${DIAL_DIMENSIONS.viewBox.height}`}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
        {/* Outer Ring - Decade */}
        <motion.g
          animate={{ rotate: state.ringStates.decade.rotationAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Ring
            ringType="decade"
            segments={ringConfig.decades}
            radius={getRingRadius('decade')}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.decade.isLocked}
            color={state.ringStates.decade.color}
            isBlurred={false}
            showIncorrectFlash={state.ringStates.decade.showIncorrectFlash}
            incorrectGuesses={state.ringStates.decade.incorrectGuesses}
            correctAnswer={state.correctAnswer.decade}
            onFlashComplete={() => handleFlashComplete('decade')}
          />
        </motion.g>

        {/* Middle Ring - Year */}
        <motion.g
          animate={{ rotate: state.ringStates.year.rotationAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Ring
            ringType="year"
            segments={yearsForDecade}
            radius={getRingRadius('year')}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.year.isLocked}
            color={state.ringStates.year.color}
            isBlurred={!state.ringStates.decade.isLocked}
            showIncorrectFlash={state.ringStates.year.showIncorrectFlash}
            incorrectGuesses={state.ringStates.year.incorrectGuesses}
            correctAnswer={state.correctAnswer.year}
            onFlashComplete={() => handleFlashComplete('year')}
          />
        </motion.g>

        {/* Inner Ring - Month */}
        <motion.g
          animate={{ rotate: state.ringStates.month.rotationAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Ring
            ringType="month"
            segments={ringConfig.months}
            radius={getRingRadius('month')}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.month.isLocked}
            color={state.ringStates.month.color}
            isBlurred={!state.ringStates.year.isLocked}
            showIncorrectFlash={state.ringStates.month.showIncorrectFlash}
            incorrectGuesses={state.ringStates.month.incorrectGuesses}
            correctAnswer={state.correctAnswer.month}
            onFlashComplete={() => handleFlashComplete('month')}
          />
        </motion.g>

        {/* Invisible hit area for active ring only */}
        {!state.ringStates[state.currentRing].isLocked && (() => {
          const { radius, strokeWidth } = getRingDimensions(state.currentRing);
          const outerRadius = radius + strokeWidth / 2;
          const innerRadius = radius - strokeWidth / 2;

          // Create a donut-shaped path for the ring hit area
          const donutPath = `
            M 200 ${200 - outerRadius}
            A ${outerRadius} ${outerRadius} 0 1 1 200 ${200 + outerRadius}
            A ${outerRadius} ${outerRadius} 0 1 1 200 ${200 - outerRadius}
            M 200 ${200 - innerRadius}
            A ${innerRadius} ${innerRadius} 0 1 0 200 ${200 + innerRadius}
            A ${innerRadius} ${innerRadius} 0 1 0 200 ${200 - innerRadius}
            Z
          `;

          return (
            <path
              d={donutPath}
              fill="transparent"
              style={{
                cursor: 'grab',
                pointerEvents: 'fill'
              }}
              onPointerDown={handlePointerDown}
            />
          );
        })()}

        {/* Center Play Button or Answer Display */}
        {state.gameStatus === 'won' || state.gameStatus === 'lost' ? (
          <AnswerDisplay
            year={state.correctAnswer.year}
            month={state.correctAnswer.month}
            radioStation={state.radioStation}
          />
        ) : (
          <PlayButton
            isPlaying={isPlaying}
            onClick={handlePlayClick}
            disabled={false}
            duration={duration}
          />
        )}

      </svg>
      </div>

      {/* Submit Button - outside SVG, below the dial */}
      {state.gameStatus !== 'won' && state.gameStatus !== 'lost' && (
        <button
          onClick={handleSubmitGuess}
          disabled={state.headlinesHeard === state.currentHeadlineIndex}
          className="rounded-full font-bold text-white transition-all select-none uppercase font-sans"
          style={{
            backgroundColor:
              state.headlinesHeard === state.currentHeadlineIndex
                ? '#94a3b8'
                : '#FFD700',
            opacity: state.headlinesHeard === state.currentHeadlineIndex ? 0.5 : 1,
            cursor:
              state.headlinesHeard === state.currentHeadlineIndex ? 'default' : 'pointer',
            fontSize: '2rem',
            padding: '1rem 4rem',
          }}
        >
          Submit
        </button>
      )}
    </div>
  );
}
