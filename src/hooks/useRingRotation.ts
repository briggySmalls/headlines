import { useState, useCallback } from 'react';
import { RingType } from '../types/game';
import { useGame } from './useGame';

interface UseRingRotationProps {
  ringType: RingType;
  segmentCount: number;
}

export function useRingRotation({
  ringType,
  segmentCount,
}: UseRingRotationProps) {
  const { state, dispatch } = useGame();
  const [isDragging, setIsDragging] = useState(false);

  const anglePerSegment = 360 / segmentCount;

  // Calculate which segment is at 12 o'clock (top)
  const getSegmentAtTop = useCallback(
    (rotation: number): number => {
      // Normalize rotation to 0-360
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      // Calculate segment index (add 90 because we start at top)
      const segmentIndex = Math.round(normalizedRotation / anglePerSegment);
      return segmentIndex % segmentCount;
    },
    [anglePerSegment, segmentCount]
  );

  // Snap rotation to nearest segment
  const snapToSegment = useCallback(
    (rotation: number): number => {
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const nearestSegment = Math.round(normalizedRotation / anglePerSegment);
      return (nearestSegment * anglePerSegment) % 360;
    },
    [anglePerSegment]
  );

  const handleDragStart = useCallback(() => {
    if (!state.ringStates[ringType].isLocked) {
      setIsDragging(true);
    }
  }, [state.ringStates, ringType]);

  const handleDrag = useCallback(
    (rotation: number) => {
      if (state.ringStates[ringType].isLocked) return;

      dispatch({
        type: 'ROTATE_RING',
        ringType,
        angle: rotation,
      });
    },
    [dispatch, ringType, state.ringStates]
  );

  const handleDragEnd = useCallback(
    (rotation: number) => {
      setIsDragging(false);
      if (state.ringStates[ringType].isLocked) return;

      // Snap to nearest segment
      const snappedRotation = snapToSegment(rotation);
      dispatch({
        type: 'ROTATE_RING',
        ringType,
        angle: snappedRotation,
      });

      // Update selected value
      const segmentIndex = getSegmentAtTop(snappedRotation);
      // The selected value will be updated by the parent component
      return segmentIndex;
    },
    [dispatch, ringType, snapToSegment, getSegmentAtTop, state.ringStates]
  );

  return {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    getSegmentAtTop,
  };
}
