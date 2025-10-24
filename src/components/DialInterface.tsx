import { useState, useRef, useCallback } from 'react';
import { Ring } from './Ring';
import { AnswerMarker } from './AnswerMarker';
import { LongPressTarget } from './LongPressTarget';
import { PlayButton } from './PlayButton';
import { AnswerDisplay } from './AnswerDisplay';
import { HeadlineCounter } from './HeadlineCounter';
import { useGame } from '../hooks/useGame';
import { ringConfig } from '../data/ringConfig';
import { motion } from 'framer-motion';
import { RingType } from '../types/game';
import { useAudioPlayer } from './AudioPlayer';

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
  const { play, replay, isPlaying } = useAudioPlayer(currentAudioSrc);

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
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const anglePerSegment = 360 / segmentCount;
      const nearestSegment = Math.round(normalizedRotation / anglePerSegment);
      return (nearestSegment * anglePerSegment) % 360;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const currentRing = state.currentRing;
      if (state.ringStates[currentRing].isLocked) return;

      const center = getCenterPoint();
      const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
      const currentRotation = state.ringStates[currentRing].rotationAngle;

      startAngleRef.current = (angle * 180) / Math.PI - currentRotation;
      currentRotationRef.current = currentRotation;
      setIsDragging(true);
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
      const newRotation = angleDegrees - startAngleRef.current;

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

  const handlePlayClick = useCallback(() => {
    // If already playing, replay from start
    if (isPlaying) {
      replay();
      return;
    }

    // First time playing this headline - increment headlinesHeard
    if (state.headlinesHeard === state.currentHeadlineIndex) {
      dispatch({ type: 'PLAY_HEADLINE' });
    }

    play();
  }, [
    isPlaying,
    replay,
    play,
    state.headlinesHeard,
    state.currentHeadlineIndex,
    dispatch,
  ]);

  return (
    <div className="relative w-full max-w-md aspect-square touch-none select-none">
      {/* Headline Counter */}
      <HeadlineCounter headlinesHeard={state.headlinesHeard} total={3} />

      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
        onPointerDown={handlePointerDown}
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
            radius={180}
            strokeWidth={40}
            rotation={0}
            isLocked={state.ringStates.decade.isLocked}
            color={state.ringStates.decade.color}
            isBlurred={false}
            showIncorrectFlash={state.ringStates.decade.showIncorrectFlash}
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
            radius={130}
            strokeWidth={40}
            rotation={0}
            isLocked={state.ringStates.year.isLocked}
            color={state.ringStates.year.color}
            isBlurred={!state.ringStates.decade.isLocked}
            showIncorrectFlash={state.ringStates.year.showIncorrectFlash}
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
            radius={80}
            strokeWidth={40}
            rotation={0}
            isLocked={state.ringStates.month.isLocked}
            color={state.ringStates.month.color}
            isBlurred={!state.ringStates.year.isLocked}
            showIncorrectFlash={state.ringStates.month.showIncorrectFlash}
            onFlashComplete={() => handleFlashComplete('month')}
          />
        </motion.g>

        {/* Answer Marker at 12 o'clock */}
        <AnswerMarker />

        {/* Long Press Target at 12 o'clock */}
        <LongPressTarget
          onLongPress={handleSubmitGuess}
          disabled={
            state.gameStatus === 'won' ||
            state.gameStatus === 'lost' ||
            state.headlinesHeard === state.currentHeadlineIndex
          }
        />

        {/* Center Play Button or Answer Display */}
        {state.gameStatus === 'won' || state.gameStatus === 'lost' ? (
          <AnswerDisplay
            decade={state.correctAnswer.decade}
            year={state.correctAnswer.year}
            month={state.correctAnswer.month}
          />
        ) : (
          <PlayButton
            isPlaying={isPlaying}
            onClick={handlePlayClick}
            disabled={false}
          />
        )}
      </svg>
    </div>
  );
}
