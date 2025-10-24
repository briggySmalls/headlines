import { GameState } from '../types/game';
import { DailyGame } from '../types/game';

export function createInitialState(dailyGame: DailyGame): GameState {
  return {
    dailyGameId: dailyGame.id,
    correctAnswer: dailyGame.answer,
    audioFiles: dailyGame.headlines,

    currentRing: 'decade',
    headlinesHeard: 0,
    currentHeadlineIndex: 0,

    ringStates: {
      decade: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: '1940s', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
      },
      year: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: '1940', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
      },
      month: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: 'Jan', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
      },
    },

    gameStatus: 'not_started',
  };
}
