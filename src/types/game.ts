export type RingType = 'decade' | 'year' | 'month';

export type GameStatus = 'not_started' | 'playing' | 'won' | 'lost';

export type RingColor = 'none' | 'gold' | 'silver' | 'bronze';

export interface RingState {
  rotationAngle: number; // degrees from 0
  isLocked: boolean;
  color: RingColor;
  selectedValue: string; // current value at 12 o'clock
  showIncorrectFlash: boolean; // triggers red flash animation on incorrect guess
}

export interface GameState {
  dailyGameId: string; // ISO date format: YYYY-MM-DD
  correctAnswer: {
    decade: string;
    year: string;
    month: string;
  };
  audioFiles: [string, string, string]; // paths to 3 headline audio files

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
    month: string; // e.g., "Aug"
  };
  headlines: [string, string, string]; // audio file paths
}

export interface RingConfig {
  decades: string[];
  getYearsForDecade: (decade: string) => string[];
  months: string[];
}
