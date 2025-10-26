import { useState, useRef, useCallback } from 'react';
import { Ring } from './Ring';
import { PlayButton } from './PlayButton';
import { LivesIndicator } from './LivesIndicator';
import { MagnifiedSegmentOverlay } from './MagnifiedSegmentOverlay';
import { useGame } from '../hooks/useGame';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useMultiAudioPlayer } from '../hooks/useMultiAudioPlayer';
import { ringConfig } from '../data/ringConfig';
import { motion } from 'framer-motion';
import { RingType, GameStatus } from '../types/game';
import { DIAL_DIMENSIONS, getRingRadius } from '../config/dialDimensions';
import { getSegmentAtTop, snapToSegment } from '../utils/ringRotation';

export function DialInterface() {
  const { state, dispatch } = useGame();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startAngleRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);

  // Get current values for each ring
  const decadeValue = state.ringStates.decade.selectedValue;
  // When game is over, show years for the correct decade, otherwise show for selected decade
  const decadeToUse = state.gameStatus === GameStatus.Lost || state.gameStatus === GameStatus.Won
    ? state.correctAnswer.decade
    : decadeValue;
  const yearsForDecade = ringConfig.getYearsForDecade(decadeToUse);

  // Audio player for current headline during game
  const currentAudioSrc =
    state.audioFiles[state.currentHeadlineIndex] || state.audioFiles[0];
  const singlePlayer = useAudioPlayer(currentAudioSrc);

  // Use appropriate player based on game status
  const isGameOver = state.gameStatus === GameStatus.Won || state.gameStatus === GameStatus.Lost;

  // Multi-track player for game over (plays all 3 consecutively) - only enabled when game is over
  const multiPlayer = useMultiAudioPlayer(state.audioFiles, isGameOver);

  const { play, isPlaying, duration } = isGameOver ? multiPlayer : singlePlayer;

  const getCenterPoint = useCallback(() => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

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
      currentRing === RingType.Decade
        ? ringConfig.decades
        : currentRing === RingType.Year
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

    // If game is over, play all tracks consecutively
    if (isGameOver && 'playAll' in multiPlayer) {
      multiPlayer.playAll();
      return;
    }

    // During game: First time playing this headline - increment headlinesHeard
    if (state.headlinesHeard === state.currentHeadlineIndex) {
      dispatch({ type: 'PLAY_HEADLINE' });
    }

    play();
  }, [isPlaying, play, state.headlinesHeard, state.currentHeadlineIndex, dispatch, isGameOver, multiPlayer]);

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
            ringType={RingType.Decade}
            segments={ringConfig.decades}
            radius={getRingRadius(RingType.Decade)}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.decade.isLocked}
            color={state.ringStates.decade.color}
            isBlurred={false}
            showIncorrectFlash={state.ringStates.decade.showIncorrectFlash}
            incorrectGuesses={state.ringStates.decade.incorrectGuesses}
            correctAnswer={state.correctAnswer.decade}
            onFlashComplete={() => handleFlashComplete(RingType.Decade)}
          />
        </motion.g>

        {/* Middle Ring - Year */}
        <motion.g
          animate={{ rotate: state.ringStates.year.rotationAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Ring
            ringType={RingType.Year}
            segments={yearsForDecade}
            radius={getRingRadius(RingType.Year)}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.year.isLocked}
            color={state.ringStates.year.color}
            isBlurred={!state.ringStates.decade.isLocked}
            showIncorrectFlash={state.ringStates.year.showIncorrectFlash}
            incorrectGuesses={state.ringStates.year.incorrectGuesses}
            correctAnswer={state.correctAnswer.year}
            onFlashComplete={() => handleFlashComplete(RingType.Year)}
          />
        </motion.g>

        {/* Inner Ring - Month */}
        <motion.g
          animate={{ rotate: state.ringStates.month.rotationAngle }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Ring
            ringType={RingType.Month}
            segments={ringConfig.months}
            radius={getRingRadius(RingType.Month)}
            strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
            rotation={0}
            isLocked={state.ringStates.month.isLocked}
            color={state.ringStates.month.color}
            isBlurred={!state.ringStates.year.isLocked}
            showIncorrectFlash={state.ringStates.month.showIncorrectFlash}
            incorrectGuesses={state.ringStates.month.incorrectGuesses}
            correctAnswer={state.correctAnswer.month}
            onFlashComplete={() => handleFlashComplete(RingType.Month)}
          />
        </motion.g>

        {/* Magnified segment overlays */}
        {isGameOver ? (
          // Game over: show magnification on all rings
          <>
            <MagnifiedSegmentOverlay
              segments={ringConfig.decades}
              rotation={state.ringStates.decade.rotationAngle}
              radius={getRingRadius(RingType.Decade)}
              strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
              color={state.ringStates.decade.color}
              isLocked={state.ringStates.decade.isLocked}
            />
            <MagnifiedSegmentOverlay
              segments={yearsForDecade}
              rotation={state.ringStates.year.rotationAngle}
              radius={getRingRadius(RingType.Year)}
              strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
              color={state.ringStates.year.color}
              isLocked={state.ringStates.year.isLocked}
            />
            <MagnifiedSegmentOverlay
              segments={ringConfig.months}
              rotation={state.ringStates.month.rotationAngle}
              radius={getRingRadius(RingType.Month)}
              strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
              color={state.ringStates.month.color}
              isLocked={state.ringStates.month.isLocked}
            />
          </>
        ) : (
          // During gameplay: show magnification only on active unlocked ring
          !state.ringStates[state.currentRing].isLocked && (() => {
            const currentRing = state.currentRing;
            const segments =
              currentRing === RingType.Decade
                ? ringConfig.decades
                : currentRing === RingType.Year
                  ? yearsForDecade
                  : ringConfig.months;

            return (
              <MagnifiedSegmentOverlay
                segments={segments}
                rotation={state.ringStates[currentRing].rotationAngle}
                radius={getRingRadius(currentRing)}
                strokeWidth={DIAL_DIMENSIONS.ringStrokeWidth}
                color={state.ringStates[currentRing].color}
                isLocked={state.ringStates[currentRing].isLocked}
              />
            );
          })()
        )}

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

        {/* Center Play Button */}
        <PlayButton
          isPlaying={isPlaying}
          onClick={handlePlayClick}
          disabled={false}
          duration={duration}
        />

      </svg>
      </div>

      {/* Lives Indicator - shows mistakes made */}
      {state.gameStatus !== GameStatus.Won && state.gameStatus !== GameStatus.Lost && (
        <LivesIndicator mistakesMade={state.currentHeadlineIndex} />
      )}

      {/* Submit Button - outside SVG, below the dial */}
      {state.gameStatus !== GameStatus.Won && state.gameStatus !== GameStatus.Lost && (
        <button
          onClick={handleSubmitGuess}
          disabled={state.headlinesHeard === state.currentHeadlineIndex}
          className="font-bold transition-all select-none uppercase font-sans"
          style={{
            // Match play button: solid dark background with light text
            backgroundColor: state.headlinesHeard === state.currentHeadlineIndex
              ? '#94a3b8'  // slate-400 when disabled
              : '#1e293b', // slate-800 when active (matches play button)
            border: 'none',
            borderRadius: '0.75rem', // rounded-xl equivalent (12px)
            color: state.headlinesHeard === state.currentHeadlineIndex
              ? '#64748b'  // slate-500 (darker text for contrast on gray bg)
              : '#f1f5f9', // slate-100 (matches play button icon)
            cursor: state.headlinesHeard === state.currentHeadlineIndex ? 'not-allowed' : 'pointer',
            fontSize: '2rem',
            padding: '0.75rem 3rem', // Thinner than before
            boxShadow: state.headlinesHeard === state.currentHeadlineIndex
              ? 'none'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          onMouseEnter={(e) => {
            if (state.headlinesHeard !== state.currentHeadlineIndex) {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (state.headlinesHeard !== state.currentHeadlineIndex) {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
}
