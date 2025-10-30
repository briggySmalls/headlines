import { GameState, RingType, GameStatus, RingColor } from '../types/game';
import { DailyGame } from '../types/game';

export function createInitialState(dailyGame: DailyGame): GameState {
  return {
    dailyGameId: dailyGame.id,
    correctAnswer: dailyGame.answer,
    audioFiles: dailyGame.headlines,
    transcripts: dailyGame.transcripts,
    radioStation: dailyGame.radioStation,

    currentRing: RingType.Decade,
    headlinesHeard: 0,
    currentHeadlineIndex: 0,

    ringStates: {
      [RingType.Decade]: {
        isLocked: false,
        color: RingColor.None,
        selectedValue: '1940s', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
      [RingType.Year]: {
        isLocked: false,
        color: RingColor.None,
        selectedValue: '1940', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
      [RingType.Month]: {
        isLocked: false,
        color: RingColor.None,
        selectedValue: 'Jan-Mar', // segment 0 at 12 o'clock
        showIncorrectFlash: false,
        incorrectGuesses: [],
      },
    },

    gameStatus: GameStatus.NotStarted,
  };
}
