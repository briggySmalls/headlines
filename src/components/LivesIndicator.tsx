interface LivesIndicatorProps {
  mistakesMade: number; // 0-3, represents how many incorrect guesses have been made
}

export function LivesIndicator({ mistakesMade }: LivesIndicatorProps) {
  const totalLives = 3;

  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: totalLives }).map((_, index) => {
        // A life is "lost" when a mistake is made
        // mistakesMade = 0: all empty (light gray)
        // mistakesMade = 1: first one filled (dark)
        // mistakesMade = 2: first two filled (dark)
        // mistakesMade = 3: all three filled (dark) - game lost
        const isLost = index < mistakesMade;

        return (
          <div
            key={index}
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #1e293b', // slate-800 dark border
              backgroundColor: isLost ? '#1e293b' : '#f1f5f9', // dark when lost, light gray when available
              borderRadius: '2px',
              transition: 'background-color 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}
