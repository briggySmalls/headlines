import { GameState, RingType, GameStatus, RingColor } from '../types/game';
import { DailyGame } from '../types/game';

export function createInitialState(dailyGame: DailyGame): GameState {
  return {
    dailyGameId: dailyGame.id,
    correctAnswer: dailyGame.answer,
    audioFiles: dailyGame.headlines,
    radioStation: dailyGame.radioStation,

    currentRing: RingType.Decade,
    headlinesHeard: 0,
    currentHeadlineIndex: 0,

    ringStates: {
      [RingType.Decade]: {
        rotationAngle: 0,
        isLocked: false,
        color: RingColor.None,
        selectedValue: '1940s', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
      [RingType.Year]: {
        rotationAngle: 0,
        isLocked: false,
        color: RingColor.None,
        selectedValue: '1940', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
      [RingType.Month]: {
        rotationAngle: 0,
        isLocked: false,
        color: RingColor.None,
        selectedValue: 'Jan', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
    },

    gameStatus: GameStatus.NotStarted,
  };
}
