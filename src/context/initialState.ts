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
        selectedValue: '1990s', // default starting value
      },
      year: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: '1990', // default starting value
      },
      month: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: 'Jan', // default starting value
      },
    },

    gameStatus: 'not_started',
  };
}
