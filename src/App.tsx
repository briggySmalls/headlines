import { useState, useCallback } from 'react';
import { DialInterface } from './components/DialInterface';
import { NewsTicker } from './components/NewsTicker';
import { useGame } from './hooks/useGame';
import { GameStatus } from './types/game';

function App() {
  const { state } = useGame();
  const [audioState, setAudioState] = useState({ isPlaying: false, duration: 0, currentTrackIndex: 0, currentTrackDuration: undefined as number | undefined });

  // Receive audio state from DialInterface
  const handleAudioStateChange = useCallback((isPlaying: boolean, duration: number, currentTrackIndex: number, currentTrackDuration?: number) => {
    setAudioState({ isPlaying, duration, currentTrackIndex, currentTrackDuration });
  }, []);

  // Current transcript text - use currentTrackIndex when playing multiple tracks (game over)
  const isGameOver = state.gameStatus === GameStatus.Won || state.gameStatus === GameStatus.Lost;
  const transcriptIndex = isGameOver ? audioState.currentTrackIndex : state.currentHeadlineIndex;
  const currentTranscript = state.transcripts[transcriptIndex] || state.transcripts[0];

  // Use individual track duration when available (multi-track playback), otherwise use total duration
  const tickerDuration = audioState.currentTrackDuration ?? audioState.duration;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center p-4">
      <h1 className="font-bold text-white mt-8 mb-8 select-none uppercase" style={{ fontSize: '3rem' }}>
        Headlines
      </h1>
      <NewsTicker
        text={currentTranscript}
        isPlaying={audioState.isPlaying}
        duration={tickerDuration}
      />
      <div style={{ marginTop: '2rem' }}>
        <DialInterface onAudioStateChange={handleAudioStateChange} />
      </div>
    </div>
  );
}

export default App;
