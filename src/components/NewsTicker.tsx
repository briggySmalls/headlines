import { useEffect, useRef, useState } from 'react';

interface NewsTickerProps {
  text: string;
  isPlaying: boolean;
  duration: number; // Audio duration in seconds
}

export function NewsTicker({ text, isPlaying, duration }: NewsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Start animation when audio starts playing
  useEffect(() => {
    if (isPlaying && duration > 0) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [isPlaying, duration]);

  // Reset animation when text changes
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(prev => prev + 1);
    // If audio is already playing when text changes, restart animation
    // Otherwise stop it (user changed headline without playing)
    setShouldAnimate(isPlaying && duration > 0);
  }, [text, isPlaying, duration]);

  // Animation duration = audio duration + 5 seconds for scroll-out
  const extraScrollTime = 5;
  const animationDuration = duration > 0 ? duration + extraScrollTime : 20;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden select-none"
      style={{
        backgroundColor: 'rgb(184, 0, 0)',
        height: '3rem',
        position: 'relative',
      }}
    >
      <div
        key={key}
        className="whitespace-nowrap absolute"
        style={{
          color: 'rgb(255, 255, 255)',
          fontFamily: 'BBC Reith Sans, sans-serif',
          fontSize: '1.5rem',
          lineHeight: '3rem',
          fontWeight: 500,
          left: '100%',
          animation: shouldAnimate
            ? `ticker-scroll ${animationDuration}s linear forwards`
            : 'none',
        }}
      >
        {text}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-200%);
          }
        }
      `}</style>
    </div>
  );
}
