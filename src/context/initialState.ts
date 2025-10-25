import { GameState } from '../types/game';
import { DailyGame } from '../types/game';

export function createInitialState(dailyGame: DailyGame): GameState {
  return {
    dailyGameId: dailyGame.id,
    correctAnswer: dailyGame.answer,
    audioFiles: dailyGame.headlines,
    radioStation: dailyGame.radioStation,

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
        incorrectGuesses: [],
      },
      year: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: '1940', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
      month: {
        rotationAngle: 0,
        isLocked: false,
        color: 'none',
        selectedValue: 'Jan', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
    },

    gameStatus: 'not_started',
  };
}
