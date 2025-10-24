/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, ReactNode } from 'react';
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

export function GameProvider({ children }: { children: ReactNode }) {
  const initialState = createInitialState(mockGame);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
