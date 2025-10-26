import { GameState, RingType, GameStatus, RingColor } from '../types/game';
import { calculateRotationToAlignAnswer } from '../utils/ringRotation';

export type GameAction =
  | { type: 'ROTATE_RING'; ringType: RingType; angle: number }
  | { type: 'SET_RING_VALUE'; ringType: RingType; value: string }
  | {
      type: 'SUBMIT_GUESS';
      ringType: RingType;
      guessedValue: string;
      isCorrect: boolean;
    }
  | { type: 'LOCK_RING'; ringType: RingType; color: RingColor }
  | { type: 'CLEAR_INCORRECT_FLASH'; ringType: RingType }
  | { type: 'PLAY_HEADLINE' }
  | { type: 'NEXT_HEADLINE' }
  | { type: 'WIN_GAME' }
  | { type: 'LOSE_GAME' }
  | { type: 'RESET_GAME'; newState: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROTATE_RING': {
      if (state.ringStates[action.ringType].isLocked) {
        return state;
      }
      return {
        ...state,
        ringStates: {
          ...state.ringStates,
          [action.ringType]: {
            ...state.ringStates[action.ringType],
            rotationAngle: action.angle,
          },
        },
      };
    }

    case 'SET_RING_VALUE': {
      if (state.ringStates[action.ringType].isLocked) {
        return state;
      }
      return {
        ...state,
        ringStates: {
          ...state.ringStates,
          [action.ringType]: {
            ...state.ringStates[action.ringType],
            selectedValue: action.value,
          },
        },
      };
    }

    case 'SUBMIT_GUESS': {
      const { ringType, isCorrect } = action;

      if (isCorrect) {
        // Correct guess - lock the ring and move to next
        const color = getColorForHeadlines(state.headlinesHeard);
        const nextRing = getNextRing(ringType);

        return {
          ...state,
          ringStates: {
            ...state.ringStates,
            [ringType]: {
              ...state.ringStates[ringType],
              isLocked: true,
              color,
            },
          },
          currentRing: nextRing || ringType,
          gameStatus: nextRing ? state.gameStatus : GameStatus.Won,
        };
      } else {
        // Incorrect guess - show red flash, add to incorrect guesses, and progress to next headline
        const guessedValue = action.guessedValue;
        const newHeadlineIndex = state.currentHeadlineIndex + 1;
        const newHeadlinesHeard = Math.min(state.headlinesHeard + 1, 3);

        // Check if game is lost (3 headlines heard and incorrect guess)
        if (state.headlinesHeard >= 3) {
          // Calculate rotation angles to show correct answers
          const decadeRotation = calculateRotationToAlignAnswer(
            RingType.Decade,
            state.correctAnswer.decade,
            state.correctAnswer.decade
          );
          const yearRotation = calculateRotationToAlignAnswer(
            RingType.Year,
            state.correctAnswer.year,
            state.correctAnswer.decade
          );
          const monthRotation = calculateRotationToAlignAnswer(
            RingType.Month,
            state.correctAnswer.month,
            state.correctAnswer.decade
          );

          const updatedRingStates = {
            decade: {
              ...state.ringStates.decade,
              isLocked: true,
              rotationAngle: decadeRotation,
            },
            year: {
              ...state.ringStates.year,
              isLocked: true,
              rotationAngle: yearRotation,
            },
            month: {
              ...state.ringStates.month,
              isLocked: true,
              rotationAngle: monthRotation,
            },
          };

          // Update the current ring with the incorrect guess
          updatedRingStates[ringType] = {
            ...updatedRingStates[ringType],
            showIncorrectFlash: true,
            incorrectGuesses: [
              ...state.ringStates[ringType].incorrectGuesses,
              guessedValue,
            ],
          };

          return {
            ...state,
            ringStates: updatedRingStates,
            gameStatus: GameStatus.Lost,
          };
        }

        return {
          ...state,
          ringStates: {
            ...state.ringStates,
            [ringType]: {
              ...state.ringStates[ringType],
              showIncorrectFlash: true,
              incorrectGuesses: [
                ...state.ringStates[ringType].incorrectGuesses,
                guessedValue,
              ],
            },
          },
          currentHeadlineIndex: newHeadlineIndex,
          headlinesHeard: newHeadlinesHeard,
        };
      }
    }

    case 'LOCK_RING': {
      return {
        ...state,
        ringStates: {
          ...state.ringStates,
          [action.ringType]: {
            ...state.ringStates[action.ringType],
            isLocked: true,
            color: action.color,
          },
        },
      };
    }

    case 'CLEAR_INCORRECT_FLASH': {
      return {
        ...state,
        ringStates: {
          ...state.ringStates,
          [action.ringType]: {
            ...state.ringStates[action.ringType],
            showIncorrectFlash: false,
          },
        },
      };
    }

    case 'PLAY_HEADLINE': {
      // Increment headlinesHeard only if this is the first time playing this headline
      const shouldIncrement =
        state.headlinesHeard === state.currentHeadlineIndex;
      return {
        ...state,
        headlinesHeard: shouldIncrement
          ? state.headlinesHeard + 1
          : state.headlinesHeard,
        gameStatus:
          state.gameStatus === GameStatus.NotStarted ? GameStatus.Playing : state.gameStatus,
      };
    }

    case 'NEXT_HEADLINE': {
      return {
        ...state,
        currentHeadlineIndex: Math.min(state.currentHeadlineIndex + 1, 2),
      };
    }

    case 'WIN_GAME': {
      return {
        ...state,
        gameStatus: GameStatus.Won,
      };
    }

    case 'LOSE_GAME': {
      return {
        ...state,
        gameStatus: GameStatus.Lost,
      };
    }

    case 'RESET_GAME': {
      return action.newState;
    }

    default:
      return state;
  }
}

function getColorForHeadlines(headlinesHeard: number): RingColor {
  if (headlinesHeard === 1) return RingColor.Gold;
  if (headlinesHeard === 2) return RingColor.Silver;
  if (headlinesHeard === 3) return RingColor.Bronze;
  return RingColor.None;
}

function getNextRing(currentRing: RingType): RingType | null {
  if (currentRing === RingType.Decade) return RingType.Year;
  if (currentRing === RingType.Year) return RingType.Month;
  return null; // month is the last ring
}
