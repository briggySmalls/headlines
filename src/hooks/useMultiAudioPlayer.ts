import { useEffect, useRef, useState, useCallback } from 'react';

export function useMultiAudioPlayer(srcs: string[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackDurations, setTrackDurations] = useState<number[]>([]);
  const isPlayingAllRef = useRef(false);
  const playAllStartTimeRef = useRef<number>(0);

  // Pre-load all track durations
  useEffect(() => {
    const loadDurations = async () => {
      const durations: number[] = [];
      for (const src of srcs) {
        const audio = new Audio(src);
        await new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            durations.push(audio.duration);
            resolve();
          });
        });
      }
      setTrackDurations(durations);
    };
    loadDurations();
  }, [srcs]);

  // Calculate total duration when playing all tracks
  const totalDuration = trackDurations.reduce((sum, d) => sum + d, 0);

  // Load current track
  useEffect(() => {
    if (!srcs[currentTrackIndex]) return;

    const audio = new Audio(srcs[currentTrackIndex]);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (!isPlayingAllRef.current) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      // If playing all tracks, move to next
      if (isPlayingAllRef.current && currentTrackIndex < srcs.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        // All tracks finished or single track mode
        setIsPlaying(false);
        isPlayingAllRef.current = false;
        setCurrentTrackIndex(0);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrackIndex, srcs]);

  // Auto-play next track when index changes during playAll
  useEffect(() => {
    if (isPlayingAllRef.current && currentTrackIndex > 0) {
      setIsPlaying(true);
      audioRef.current?.play().catch(() => {
        // Ignore play errors
      });
    }
  }, [currentTrackIndex]);

  const play = useCallback(() => {
    setIsPlaying(true);
    audioRef.current?.play().catch(() => {
      // Ignore play errors
    });
  }, []);

  const playAll = useCallback(() => {
    isPlayingAllRef.current = true;
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setDuration(totalDuration);
    playAllStartTimeRef.current = Date.now();
    // Audio will be loaded by useEffect and played
    setTimeout(() => {
      audioRef.current?.play().catch(() => {
        // Ignore play errors
      });
    }, 100);
  }, [totalDuration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    isPlayingAllRef.current = false;
    audioRef.current?.pause();
  }, []);

  return { play, playAll, pause, isPlaying, duration, currentTrackIndex };
}
