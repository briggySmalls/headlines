import { GameState, RingState, RingColor, RingType, GameStatus } from '../types/game';

/**
 * Creates a mock RingState with default values
 * Can be overridden with partial values
 */
export function createRingState(overrides?: Partial<RingState>): RingState {
  return {
    isLocked: false,
    color: RingColor.None,
    selectedValue: '',
    showIncorrectFlash: false,
    incorrectGuesses: [],
    ...overrides,
  };
}

/**
 * Creates a complete mock GameState for testing
 * Can be overridden with partial values
 */
export function createMockGameState(
  overrides?: Partial<GameState>
): GameState {
  return {
    dailyGameId: '2025-01-01',
    correctAnswer: {
      decade: '1990s',
      year: '1995',
      month: 'Jul-Sep',
    },
    audioFiles: ['/audio1.mp3', '/audio2.mp3', '/audio3.mp3'],
    radioStation: 'Radio 4',
    currentRing: RingType.Decade,
    headlinesHeard: 0,
    currentHeadlineIndex: 0,
    ringStates: {
      decade: createRingState({ selectedValue: '1940s' }),
      year: createRingState({ selectedValue: '1940' }),
      month: createRingState({ selectedValue: 'Jan-Mar' }),
    },
    gameStatus: GameStatus.NotStarted,
    ...overrides,
  };
}

/**
 * Creates a game state where the decade has already been correctly guessed
 */
export function createStateWithDecadeLocked(
  color: RingColor = RingColor.Gold
): GameState {
  return createMockGameState({
    currentRing: RingType.Year,
    headlinesHeard: 1,
    ringStates: {
      decade: createRingState({
        selectedValue: '1990s',
        isLocked: true,
        color,
      }),
      year: createRingState({ selectedValue: '1940' }),
      month: createRingState({ selectedValue: 'Jan-Mar' }),
    },
    gameStatus: GameStatus.Playing,
  });
}

/**
 * Creates a game state where decade and year have been correctly guessed
 */
export function createStateWithYearLocked(
  decadeColor: RingColor = RingColor.Gold,
  yearColor: RingColor = RingColor.Silver
): GameState {
  return createMockGameState({
    currentRing: RingType.Month,
    headlinesHeard: 2,
    ringStates: {
      decade: createRingState({
        selectedValue: '1990s',
        isLocked: true,
        color: decadeColor,
      }),
      year: createRingState({
        selectedValue: '1995',
        isLocked: true,
        color: yearColor,
      }),
      month: createRingState({ selectedValue: 'Jan' }),
    },
    gameStatus: GameStatus.Playing,
  });
}

/**
 * Creates a game state where 3 headlines have been heard
 * (next incorrect guess will lose the game)
 */
export function createStateWithThreeHeadlinesHeard(): GameState {
  return createMockGameState({
    currentRing: RingType.Decade,
    headlinesHeard: 3,
    currentHeadlineIndex: 2,
    ringStates: {
      decade: createRingState({
        selectedValue: '1940s',
        incorrectGuesses: ['1950s', '1960s'],
      }),
      year: createRingState({ selectedValue: '1940' }),
      month: createRingState({ selectedValue: 'Jan-Mar' }),
    },
    gameStatus: GameStatus.Playing,
  });
}
