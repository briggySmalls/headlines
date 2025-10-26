import { useEffect, useRef, useState, useCallback } from 'react';

export function useMultiAudioPlayer(srcs: string[], enabled: boolean = true) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackDurations, setTrackDurations] = useState<number[]>([]);
  const isPlayingAllRef = useRef(false);
  const playAllStartTimeRef = useRef<number>(0);

  // Pre-load all track durations
  useEffect(() => {
    const audioElements: HTMLAudioElement[] = [];
    let cancelled = false;

    const loadDurations = async () => {
      const durations: number[] = [];
      for (const src of srcs) {
        if (cancelled) break;

        const audio = new Audio(src);
        audioElements.push(audio);

        await new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            durations.push(audio.duration);
            resolve();
          });
        });
      }
      if (!cancelled) {
        setTrackDurations(durations);
      }
    };

    loadDurations();

    return () => {
      cancelled = true;
      audioElements.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [srcs]);

  // Calculate total duration when playing all tracks
  const totalDuration = trackDurations.reduce((sum, d) => sum + d, 0);

  // Load current track
  useEffect(() => {
    if (!enabled || !srcs[currentTrackIndex] || currentTrackIndex < 0) return;

    const audio = new Audio(srcs[currentTrackIndex]);
    audioRef.current = audio;
    let isMounted = true;

    const handleLoadedMetadata = () => {
      if (!isMounted) return;

      if (!isPlayingAllRef.current) {
        setDuration(audio.duration);
      }
      // If we're playing all and just loaded, start playing
      if (isPlayingAllRef.current && isPlaying && isMounted) {
        audio.play().catch((err) => {
          // Only log if not an abort error from cleanup
          if (err.name !== 'AbortError') {
            console.error('Play error:', err);
          }
        });
      }
    };

    const handleEnded = () => {
      if (!isMounted) return;

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
      isMounted = false;
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrackIndex, srcs, isPlaying, enabled]);

  const play = useCallback(() => {
    setIsPlaying(true);
    audioRef.current?.play().catch(() => {
      // Ignore play errors
    });
  }, []);

  const playAll = useCallback(() => {
    isPlayingAllRef.current = true;
    setDuration(totalDuration);
    playAllStartTimeRef.current = Date.now();

    // Force reload from track 0
    setCurrentTrackIndex(-1);
    setTimeout(() => {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }, 10);
  }, [totalDuration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    isPlayingAllRef.current = false;
    audioRef.current?.pause();
  }, []);

  return { play, playAll, pause, isPlaying, duration, currentTrackIndex };
}
