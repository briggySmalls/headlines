// Enums for state machine values
export enum RingType {
  Decade = 'decade',
  Year = 'year',
  Month = 'month',
}

export enum GameStatus {
  NotStarted = 'not_started',
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost',
}

// Const object for color configuration values
export const RingColor = {
  None: 'none',
  Gold: 'gold',
  Silver: 'silver',
  Bronze: 'bronze',
  Red: 'red',
} as const;

export type RingColor = typeof RingColor[keyof typeof RingColor];

export interface RingState {
  isLocked: boolean;
  color: RingColor;
  selectedValue: string; // current value at 12 o'clock
  showIncorrectFlash: boolean; // triggers red flash animation on incorrect guess
  incorrectGuesses: string[]; // segments that were guessed incorrectly
}

export interface GameState {
  dailyGameId: string; // ISO date format: YYYY-MM-DD
  correctAnswer: {
    decade: string;
    year: string;
    month: string;
  };
  audioFiles: [string, string, string]; // paths to 3 headline audio files
  radioStation: string; // e.g., "Radio 4"

  currentRing: RingType;
  headlinesHeard: number; // 0-3 (0 = none played yet)
  currentHeadlineIndex: number; // 0, 1, or 2

  ringStates: {
    decade: RingState;
    year: RingState;
    month: RingState;
  };

  gameStatus: GameStatus;
}

export interface DailyGame {
  id: string; // ISO date: YYYY-MM-DD
  answer: {
    decade: string; // e.g., "1990s"
    year: string; // e.g., "1995"
    month: string; // e.g., "Jul-Sep"
  };
  headlines: [string, string, string]; // audio file paths
  radioStation: string; // e.g., "Radio 4"
}

export interface RingConfig {
  decades: string[];
  getYearsForDecade: (decade: string) => string[];
  months: string[];
}
