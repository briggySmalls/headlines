import { useContext } from 'react';
import { GameContext, GameContextType } from '../context/GameContext';

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
