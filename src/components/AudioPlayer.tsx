import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  onPlay?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export function AudioPlayer({
  src,
  onPlay,
  onEnded,
  autoPlay = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener('play', () => {
      setIsPlaying(true);
      onPlay?.();
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      onEnded?.();
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    if (autoPlay) {
      audio.play().catch(() => {
        // Ignore autoplay errors (browser restrictions)
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src, onPlay, onEnded, autoPlay]);

  const play = () => {
    audioRef.current?.play().catch(() => {
      // Ignore play errors
    });
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  return { play, pause, isPlaying };
}

export function useAudioPlayer(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset playing state when src changes
    setIsPlaying(false);

    const audio = new Audio(src);
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const play = () => {
    audioRef.current?.play().catch(() => {
      // Ignore play errors (browser restrictions)
    });
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const replay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore play errors
      });
    }
  };

  return { play, pause, replay, isPlaying };
}
