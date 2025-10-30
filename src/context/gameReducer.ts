import { GameState, RingType, GameStatus, RingColor } from '../types/game';

export type GameAction =
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
    case 'SET_RING_VALUE': {
      if (state.ringStates[action.ringType].isLocked) {
        return state;
      }

      let updatedRingStates = {
        ...state.ringStates,
        [action.ringType]: {
          ...state.ringStates[action.ringType],
          selectedValue: action.value,
        },
      };

      // When decade ring changes, update year ring's selectedValue to preserve the year offset
      // This keeps the year ring consistent with the new decade's year range
      if (action.ringType === RingType.Decade && !state.ringStates.year.isLocked) {
        const startYear = parseInt(action.value.slice(0, 4));
        // Extract the offset (0-9) from the current year's selectedValue
        const currentYearValue = state.ringStates.year.selectedValue;
        const currentYear = parseInt(currentYearValue);
        const yearOffset = currentYear % 10;
        updatedRingStates = {
          ...updatedRingStates,
          [RingType.Year]: {
            ...updatedRingStates[RingType.Year],
            selectedValue: (startYear + yearOffset).toString(),
          },
        };
      }

      return {
        ...state,
        ringStates: updatedRingStates,
      };
    }

    case 'SUBMIT_GUESS': {
      const { ringType, isCorrect } = action;

      if (isCorrect) {
        // Correct guess - lock the ring and move to next
        const color = getColorForHeadlines(state.headlinesHeard);
        const nextRing = getNextRing(ringType);

        let updatedRingStates = {
          ...state.ringStates,
          [ringType]: {
            ...state.ringStates[ringType],
            isLocked: true,
            color,
          },
        };

        // When decade is guessed correctly, ensure year ring's selectedValue is up to date
        // This handles the case where the decade was submitted without being rotated first
        if (ringType === RingType.Decade && nextRing === RingType.Year) {
          const startYear = parseInt(action.guessedValue.slice(0, 4));
          // Extract the offset (0-9) from the current year's selectedValue
          const currentYearValue = state.ringStates.year.selectedValue;
          const currentYear = parseInt(currentYearValue);
          const yearOffset = currentYear % 10;
          updatedRingStates = {
            ...updatedRingStates,
            [RingType.Year]: {
              ...updatedRingStates[RingType.Year],
              selectedValue: (startYear + yearOffset).toString(),
            },
          };
        }

        return {
          ...state,
          ringStates: updatedRingStates,
          currentRing: nextRing || ringType,
          gameStatus: nextRing ? state.gameStatus : GameStatus.Won,
        };
      } else {
        // Incorrect guess - show red flash, add to incorrect guesses, and progress to next headline
        const guessedValue = action.guessedValue;
        const newHeadlineIndex = state.currentHeadlineIndex + 1;

        // Check if game is lost (3 headlines heard and incorrect guess)
        if (state.headlinesHeard >= 3) {
          // Set selectedValues to show correct answers
          const updatedRingStates = {
            decade: {
              ...state.ringStates.decade,
              isLocked: true,
              selectedValue: state.correctAnswer.decade,
              // If ring was never completed (color is None), turn it red
              color: state.ringStates.decade.color === RingColor.None
                ? RingColor.Red
                : state.ringStates.decade.color,
            },
            year: {
              ...state.ringStates.year,
              isLocked: true,
              selectedValue: state.correctAnswer.year,
              color: state.ringStates.year.color === RingColor.None
                ? RingColor.Red
                : state.ringStates.year.color,
            },
            month: {
              ...state.ringStates.month,
              isLocked: true,
              selectedValue: state.correctAnswer.month,
              color: state.ringStates.month.color === RingColor.None
                ? RingColor.Red
                : state.ringStates.month.color,
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
