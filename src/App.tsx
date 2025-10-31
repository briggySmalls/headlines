import { useState, useCallback, useEffect } from 'react';
import { DialInterface } from './components/DialInterface';
import { NewsTicker } from './components/NewsTicker';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HowToPlayButton } from './components/HowToPlayButton';
import { useGame } from './hooks/useGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameStatus } from './types/game';

function App() {
  const { state } = useGame();
  const [audioState, setAudioState] = useState({ isPlaying: false, duration: 0, currentTrackIndex: 0, currentTrackDuration: undefined as number | undefined });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSeenInstructions, setHasSeenInstructions] = useLocalStorage('headlines-instructions-seen', false);

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

  // Show modal on first visit
  useEffect(() => {
    if (!hasSeenInstructions) {
      setIsModalOpen(true);
    }
  }, [hasSeenInstructions]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHasSeenInstructions(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center p-4">
      {/* Header with title */}
      <div className="flex-shrink-0 w-full flex justify-center" style={{ marginTop: 'clamp(0.5rem, 2vh, 1.5rem)', marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)' }}>
        <h1 className="font-bold text-white select-none uppercase" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', margin: 0 }}>
          Headlines
        </h1>
      </div>

      <div className="flex-shrink-0 w-full">
        <NewsTicker
          text={currentTranscript}
          isPlaying={audioState.isPlaying}
          duration={tickerDuration}
        />
      </div>

      <div className="flex-1 w-full flex items-center justify-center overflow-y-auto" style={{ paddingTop: 'clamp(0.5rem, 2vh, 1.5rem)', position: 'relative' }}>
        {/* Help button positioned above dial in top-right */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          <HowToPlayButton onClick={() => setIsModalOpen(true)} />
        </div>
        <DialInterface onAudioStateChange={handleAudioStateChange} />
      </div>

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
