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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center p-4">
      {/* Header with title and help button */}
      <div className="flex items-center gap-4 mt-8 mb-8">
        <h1 className="font-bold text-white select-none uppercase" style={{ fontSize: '3rem' }}>
          Headlines
        </h1>
        <div style={{ marginLeft: '1rem' }}>
          <HowToPlayButton onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      <NewsTicker
        text={currentTranscript}
        isPlaying={audioState.isPlaying}
        duration={tickerDuration}
      />
      <div style={{ marginTop: '2rem' }}>
        <DialInterface onAudioStateChange={handleAudioStateChange} />
      </div>

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
