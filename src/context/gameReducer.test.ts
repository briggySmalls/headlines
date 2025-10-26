import { describe, it, expect } from 'vitest';
import { gameReducer } from './gameReducer';
import { RingType, GameStatus, RingColor } from '../types/game';
import {
  createMockGameState,
  createRingState,
  createStateWithDecadeLocked,
  createStateWithYearLocked,
  createStateWithThreeHeadlinesHeard,
} from '../test/testHelpers';

describe('gameReducer', () => {
  describe('ROTATE_RING', () => {
    it('should update rotation angle for unlocked ring', () => {
      const initialState = createMockGameState();

      const newState = gameReducer(initialState, {
        type: 'ROTATE_RING',
        ringType: RingType.Decade,
        angle: 45,
      });

      expect(newState.ringStates.decade.rotationAngle).toBe(45);
    });

    it('should not update rotation angle for locked ring', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({ isLocked: true, rotationAngle: 0 }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'ROTATE_RING',
        ringType: RingType.Decade,
        angle: 45,
      });

      expect(newState.ringStates.decade.rotationAngle).toBe(0);
      expect(newState).toBe(initialState); // Should return same reference
    });

    it('should preserve other ring states', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({ rotationAngle: 10 }),
          year: createRingState({ rotationAngle: 20 }),
          month: createRingState({ rotationAngle: 30 }),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'ROTATE_RING',
        ringType: RingType.Year,
        angle: 90,
      });

      expect(newState.ringStates.decade.rotationAngle).toBe(10);
      expect(newState.ringStates.year.rotationAngle).toBe(90);
      expect(newState.ringStates.month.rotationAngle).toBe(30);
    });
  });

  describe('SET_RING_VALUE', () => {
    it('should update selected value for unlocked ring', () => {
      const initialState = createMockGameState();

      const newState = gameReducer(initialState, {
        type: 'SET_RING_VALUE',
        ringType: RingType.Decade,
        value: '1980s',
      });

      expect(newState.ringStates.decade.selectedValue).toBe('1980s');
    });

    it('should not update selected value for locked ring', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({
            isLocked: true,
            selectedValue: '1990s',
          }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SET_RING_VALUE',
        ringType: RingType.Decade,
        value: '1980s',
      });

      expect(newState.ringStates.decade.selectedValue).toBe('1990s');
      expect(newState).toBe(initialState);
    });

    it('should preserve other state properties', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({ selectedValue: '1940s' }),
          year: createRingState({ selectedValue: '1940' }),
          month: createRingState({ selectedValue: 'Jan' }),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SET_RING_VALUE',
        ringType: RingType.Year,
        value: '1995',
      });

      expect(newState.ringStates.decade.selectedValue).toBe('1940s');
      expect(newState.ringStates.year.selectedValue).toBe('1995');
      expect(newState.ringStates.month.selectedValue).toBe('Jan');
    });
  });

  describe('SUBMIT_GUESS - Correct', () => {
    it('should lock decade ring with gold color when 1 headline heard', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
        ringStates: {
          decade: createRingState({ selectedValue: '1990s' }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });

      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.decade.color).toBe(RingColor.Gold);
    });

    it('should lock decade ring with silver color when 2 headlines heard', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 2,
        ringStates: {
          decade: createRingState({ selectedValue: '1990s' }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });

      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.decade.color).toBe(RingColor.Silver);
    });

    it('should lock decade ring with bronze color when 3 headlines heard', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 3,
        ringStates: {
          decade: createRingState({ selectedValue: '1990s' }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });

      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.decade.color).toBe(RingColor.Bronze);
    });

    it('should advance from decade to year ring', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
        ringStates: {
          decade: createRingState({ selectedValue: '1990s' }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });

      expect(newState.currentRing).toBe(RingType.Year);
      expect(newState.gameStatus).toBe(GameStatus.NotStarted); // Still not won
    });

    it('should advance from year to month ring', () => {
      const initialState = createStateWithDecadeLocked();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Year,
        guessedValue: '1995',
        isCorrect: true,
      });

      expect(newState.ringStates.year.isLocked).toBe(true);
      expect(newState.currentRing).toBe(RingType.Month);
      expect(newState.gameStatus).toBe(GameStatus.Playing);
    });

    it('should set game status to won when month is guessed correctly', () => {
      const initialState = createStateWithYearLocked();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Month,
        guessedValue: 'Aug',
        isCorrect: true,
      });

      expect(newState.ringStates.month.isLocked).toBe(true);
      expect(newState.gameStatus).toBe(GameStatus.Won);
      expect(newState.currentRing).toBe(RingType.Month); // Stays on month
    });

    it('should preserve other ring states when locking one ring', () => {
      const initialState = createStateWithDecadeLocked('gold');

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Year,
        guessedValue: '1995',
        isCorrect: true,
      });

      // Decade should remain locked
      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.decade.color).toBe(RingColor.Gold);
      // Year should now be locked
      expect(newState.ringStates.year.isLocked).toBe(true);
      // Month should remain unlocked
      expect(newState.ringStates.month.isLocked).toBe(false);
    });
  });

  describe('SUBMIT_GUESS - Incorrect', () => {
    it('should add guess to incorrectGuesses array', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.ringStates.decade.incorrectGuesses).toContain('1980s');
    });

    it('should show incorrect flash', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.ringStates.decade.showIncorrectFlash).toBe(true);
    });

    it('should advance headline index', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
        currentHeadlineIndex: 0,
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.currentHeadlineIndex).toBe(1);
    });

    it('should increment headlinesHeard', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.headlinesHeard).toBe(2);
    });

    it('should cap headlinesHeard at 3', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 3,
        currentHeadlineIndex: 2,
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.headlinesHeard).toBe(3); // Doesn't exceed 3
    });

    it('should accumulate multiple incorrect guesses', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 1,
        ringStates: {
          decade: createRingState({ incorrectGuesses: ['1950s'] }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(newState.ringStates.decade.incorrectGuesses).toEqual([
        '1950s',
        '1980s',
      ]);
    });

    it('should set game status to lost when headlinesHeard >= 3', () => {
      const initialState = createStateWithThreeHeadlinesHeard();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1970s',
        isCorrect: false,
      });

      expect(newState.gameStatus).toBe(GameStatus.Lost);
    });

    it('should lock all rings and set rotation angles to show correct answers when game is lost', () => {
      const initialState = createStateWithThreeHeadlinesHeard();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1970s',
        isCorrect: false,
      });

      // All rings should be locked
      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.year.isLocked).toBe(true);
      expect(newState.ringStates.month.isLocked).toBe(true);

      // Rotation angles should be set to align correct answers at 12 o'clock
      // Decade: '1990s' is at index 5, anglePerSegment = 360/9 = 40°, rotation = -(5 * 40) = -200°
      expect(newState.ringStates.decade.rotationAngle).toBe(-200);
      // Year: '1995' is at index 5, anglePerSegment = 360/10 = 36°, rotation = -(5 * 36) = -180°
      expect(newState.ringStates.year.rotationAngle).toBe(-180);
      // Month: 'Aug' is at index 7, anglePerSegment = 360/12 = 30°, rotation = -(7 * 30) = -210°
      expect(newState.ringStates.month.rotationAngle).toBe(-210);

      // Uncompleted rings should turn red (decade was never guessed so color is None)
      expect(newState.ringStates.decade.color).toBe(RingColor.Red);
      expect(newState.ringStates.year.color).toBe(RingColor.Red);
      expect(newState.ringStates.month.color).toBe(RingColor.Red);
    });

    it('should add incorrect guess to current ring when losing', () => {
      const initialState = createStateWithThreeHeadlinesHeard();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1970s',
        isCorrect: false,
      });

      expect(newState.ringStates.decade.incorrectGuesses).toContain('1970s');
      expect(newState.ringStates.decade.showIncorrectFlash).toBe(true);
    });

    it('should keep completed ring colors (gold/silver/bronze) but turn uncompleted rings red on loss', () => {
      // Start with decade already locked as gold
      const initialState = createStateWithDecadeLocked(RingColor.Gold);
      // Simulate 3 headlines heard by setting state
      const stateWith3Headlines = {
        ...initialState,
        headlinesHeard: 3,
        currentHeadlineIndex: 2,
        currentRing: RingType.Year,
      };

      // Lose on year ring
      const newState = gameReducer(stateWith3Headlines, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Year,
        guessedValue: '1993',
        isCorrect: false,
      });

      // Decade was already completed - should keep gold color
      expect(newState.ringStates.decade.color).toBe(RingColor.Gold);
      // Year was never completed - should turn red
      expect(newState.ringStates.year.color).toBe(RingColor.Red);
      // Month was never completed - should turn red
      expect(newState.ringStates.month.color).toBe(RingColor.Red);
      expect(newState.gameStatus).toBe(GameStatus.Lost);
    });

    it('should work for incorrect guess on year ring', () => {
      const initialState = createStateWithDecadeLocked();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Year,
        guessedValue: '1993',
        isCorrect: false,
      });

      expect(newState.ringStates.year.incorrectGuesses).toContain('1993');
      expect(newState.ringStates.year.showIncorrectFlash).toBe(true);
      expect(newState.headlinesHeard).toBe(2);
    });

    it('should work for incorrect guess on month ring', () => {
      const initialState = createStateWithYearLocked();

      const newState = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Month,
        guessedValue: 'Jul',
        isCorrect: false,
      });

      expect(newState.ringStates.month.incorrectGuesses).toContain('Jul');
      expect(newState.ringStates.month.showIncorrectFlash).toBe(true);
      expect(newState.headlinesHeard).toBe(3);
    });
  });

  describe('LOCK_RING', () => {
    it('should lock ring and set color', () => {
      const initialState = createMockGameState();

      const newState = gameReducer(initialState, {
        type: 'LOCK_RING',
        ringType: RingType.Decade,
        color: 'gold',
      });

      expect(newState.ringStates.decade.isLocked).toBe(true);
      expect(newState.ringStates.decade.color).toBe(RingColor.Gold);
    });

    it('should work with all ring types and colors', () => {
      const initialState = createMockGameState();

      const stateAfterDecade = gameReducer(initialState, {
        type: 'LOCK_RING',
        ringType: RingType.Decade,
        color: 'gold',
      });

      const stateAfterYear = gameReducer(stateAfterDecade, {
        type: 'LOCK_RING',
        ringType: RingType.Year,
        color: 'silver',
      });

      const finalState = gameReducer(stateAfterYear, {
        type: 'LOCK_RING',
        ringType: RingType.Month,
        color: 'bronze',
      });

      expect(finalState.ringStates.decade.isLocked).toBe(true);
      expect(finalState.ringStates.decade.color).toBe(RingColor.Gold);
      expect(finalState.ringStates.year.isLocked).toBe(true);
      expect(finalState.ringStates.year.color).toBe(RingColor.Silver);
      expect(finalState.ringStates.month.isLocked).toBe(true);
      expect(finalState.ringStates.month.color).toBe(RingColor.Bronze);
    });

    it('should preserve other ring state properties', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({
            rotationAngle: 90,
            selectedValue: '1990s',
            incorrectGuesses: ['1980s'],
          }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'LOCK_RING',
        ringType: RingType.Decade,
        color: 'gold',
      });

      expect(newState.ringStates.decade.rotationAngle).toBe(90);
      expect(newState.ringStates.decade.selectedValue).toBe('1990s');
      expect(newState.ringStates.decade.incorrectGuesses).toEqual(['1980s']);
    });
  });

  describe('CLEAR_INCORRECT_FLASH', () => {
    it('should clear showIncorrectFlash flag', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({ showIncorrectFlash: true }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'CLEAR_INCORRECT_FLASH',
        ringType: RingType.Decade,
      });

      expect(newState.ringStates.decade.showIncorrectFlash).toBe(false);
    });

    it('should work for all ring types', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({ showIncorrectFlash: true }),
          year: createRingState({ showIncorrectFlash: true }),
          month: createRingState({ showIncorrectFlash: true }),
        },
      });

      const stateAfterDecade = gameReducer(initialState, {
        type: 'CLEAR_INCORRECT_FLASH',
        ringType: RingType.Decade,
      });

      const stateAfterYear = gameReducer(stateAfterDecade, {
        type: 'CLEAR_INCORRECT_FLASH',
        ringType: RingType.Year,
      });

      const finalState = gameReducer(stateAfterYear, {
        type: 'CLEAR_INCORRECT_FLASH',
        ringType: RingType.Month,
      });

      expect(finalState.ringStates.decade.showIncorrectFlash).toBe(false);
      expect(finalState.ringStates.year.showIncorrectFlash).toBe(false);
      expect(finalState.ringStates.month.showIncorrectFlash).toBe(false);
    });

    it('should preserve other properties', () => {
      const initialState = createMockGameState({
        ringStates: {
          decade: createRingState({
            showIncorrectFlash: true,
            incorrectGuesses: ['1980s'],
            rotationAngle: 45,
          }),
          year: createRingState(),
          month: createRingState(),
        },
      });

      const newState = gameReducer(initialState, {
        type: 'CLEAR_INCORRECT_FLASH',
        ringType: RingType.Decade,
      });

      expect(newState.ringStates.decade.incorrectGuesses).toEqual(['1980s']);
      expect(newState.ringStates.decade.rotationAngle).toBe(45);
    });
  });

  describe('PLAY_HEADLINE', () => {
    it('should increment headlinesHeard when playing new headline', () => {
      const initialState = createMockGameState({
        headlinesHeard: 0,
        currentHeadlineIndex: 0,
      });

      const newState = gameReducer(initialState, {
        type: 'PLAY_HEADLINE',
      });

      expect(newState.headlinesHeard).toBe(1);
    });

    it('should not increment headlinesHeard when replaying', () => {
      const initialState = createMockGameState({
        headlinesHeard: 2,
        currentHeadlineIndex: 1,
      });

      const newState = gameReducer(initialState, {
        type: 'PLAY_HEADLINE',
      });

      expect(newState.headlinesHeard).toBe(2);
    });

    it('should change status from not_started to playing', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.NotStarted,
        headlinesHeard: 0,
        currentHeadlineIndex: 0,
      });

      const newState = gameReducer(initialState, {
        type: 'PLAY_HEADLINE',
      });

      expect(newState.gameStatus).toBe(GameStatus.Playing);
    });

    it('should not change status if already playing', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Playing,
        headlinesHeard: 1,
        currentHeadlineIndex: 1,
      });

      const newState = gameReducer(initialState, {
        type: 'PLAY_HEADLINE',
      });

      expect(newState.gameStatus).toBe(GameStatus.Playing);
    });

    it('should not change status if game is won', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Won,
        headlinesHeard: 3,
        currentHeadlineIndex: 2,
      });

      const newState = gameReducer(initialState, {
        type: 'PLAY_HEADLINE',
      });

      expect(newState.gameStatus).toBe(GameStatus.Won);
    });
  });

  describe('NEXT_HEADLINE', () => {
    it('should advance headline index', () => {
      const initialState = createMockGameState({
        currentHeadlineIndex: 0,
      });

      const newState = gameReducer(initialState, {
        type: 'NEXT_HEADLINE',
      });

      expect(newState.currentHeadlineIndex).toBe(1);
    });

    it('should cap headline index at 2', () => {
      const initialState = createMockGameState({
        currentHeadlineIndex: 2,
      });

      const newState = gameReducer(initialState, {
        type: 'NEXT_HEADLINE',
      });

      expect(newState.currentHeadlineIndex).toBe(2);
    });

    it('should preserve other state', () => {
      const initialState = createMockGameState({
        currentHeadlineIndex: 0,
        headlinesHeard: 1,
        gameStatus: GameStatus.Playing,
      });

      const newState = gameReducer(initialState, {
        type: 'NEXT_HEADLINE',
      });

      expect(newState.headlinesHeard).toBe(1);
      expect(newState.gameStatus).toBe(GameStatus.Playing);
    });
  });

  describe('WIN_GAME', () => {
    it('should set game status to won', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Playing,
      });

      const newState = gameReducer(initialState, {
        type: 'WIN_GAME',
      });

      expect(newState.gameStatus).toBe(GameStatus.Won);
    });

    it('should preserve all other state', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Playing,
        headlinesHeard: 2,
        currentRing: RingType.Month,
      });

      const newState = gameReducer(initialState, {
        type: 'WIN_GAME',
      });

      expect(newState.headlinesHeard).toBe(2);
      expect(newState.currentRing).toBe(RingType.Month);
    });
  });

  describe('LOSE_GAME', () => {
    it('should set game status to lost', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Playing,
      });

      const newState = gameReducer(initialState, {
        type: 'LOSE_GAME',
      });

      expect(newState.gameStatus).toBe(GameStatus.Lost);
    });

    it('should preserve all other state', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Playing,
        headlinesHeard: 3,
        currentRing: RingType.Decade,
      });

      const newState = gameReducer(initialState, {
        type: 'LOSE_GAME',
      });

      expect(newState.headlinesHeard).toBe(3);
      expect(newState.currentRing).toBe(RingType.Decade);
    });
  });

  describe('RESET_GAME', () => {
    it('should replace entire state with new state', () => {
      const initialState = createMockGameState({
        gameStatus: GameStatus.Won,
        headlinesHeard: 3,
        currentRing: RingType.Month,
      });

      const newGameState = createMockGameState({
        dailyGameId: '2025-01-02',
        correctAnswer: {
          decade: '2000s',
          year: '2005',
          month: 'Dec',
        },
      });

      const newState = gameReducer(initialState, {
        type: 'RESET_GAME',
        newState: newGameState,
      });

      expect(newState).toEqual(newGameState);
      expect(newState.dailyGameId).toBe('2025-01-02');
      expect(newState.correctAnswer.decade).toBe('2000s');
      expect(newState.gameStatus).toBe(GameStatus.NotStarted);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown action type by returning same state', () => {
      const initialState = createMockGameState();

      const newState = gameReducer(initialState, {
        // @ts-expect-error Testing invalid action
        type: 'UNKNOWN_ACTION',
      });

      expect(newState).toBe(initialState);
    });

    it('should handle multiple incorrect guesses without exceeding 3 headlines', () => {
      const initialState = createMockGameState({
        currentRing: RingType.Decade,
        headlinesHeard: 2,
        currentHeadlineIndex: 1,
      });

      const stateAfterGuess1 = gameReducer(initialState, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1980s',
        isCorrect: false,
      });

      expect(stateAfterGuess1.headlinesHeard).toBe(3);

      // Try another incorrect guess - should trigger game loss
      const stateAfterGuess2 = gameReducer(stateAfterGuess1, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1970s',
        isCorrect: false,
      });

      expect(stateAfterGuess2.gameStatus).toBe('lost');
      expect(stateAfterGuess2.headlinesHeard).toBe(3); // Still 3
    });

    it('should correctly handle winning on different headline counts', () => {
      // Win on first headline
      const state1 = createMockGameState({ headlinesHeard: 1 });
      const afterDecade1 = gameReducer(state1, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });
      expect(afterDecade1.ringStates.decade.color).toBe(RingColor.Gold);

      // Win on third headline
      const state3 = createMockGameState({ headlinesHeard: 3 });
      const afterDecade3 = gameReducer(state3, {
        type: 'SUBMIT_GUESS',
        ringType: RingType.Decade,
        guessedValue: '1990s',
        isCorrect: true,
      });
      expect(afterDecade3.ringStates.decade.color).toBe(RingColor.Bronze);
    });
  });
});
