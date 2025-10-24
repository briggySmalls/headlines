/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState } from '../types/game';
import { gameReducer, GameAction } from './gameReducer';
import { createInitialState } from './initialState';
import { mockGame } from '../data/mockGame';

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'headlines-game-state';

function loadSavedState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    // Only restore if it's the same daily game
    if (parsed.dailyGameId === mockGame.id) {
      return parsed as GameState;
    }
    return null;
  } catch {
    return null;
  }
}

function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const savedState = loadSavedState();
  const initialState = savedState || createInitialState(mockGame);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Save state to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
