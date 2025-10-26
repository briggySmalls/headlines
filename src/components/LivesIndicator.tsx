interface LivesIndicatorProps {
  mistakesMade: number; // 0-3, represents how many incorrect guesses have been made
}

export function LivesIndicator({ mistakesMade }: LivesIndicatorProps) {
  const totalLives = 3;

  return (
    <div className="flex justify-center">
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
              width: '48px',
              height: '48px', // Square: same as width
              border: '6px solid #1e293b', // slate-800 dark border (doubled thickness)
              backgroundColor: isLost ? '#1e293b' : '#f1f5f9', // dark when lost, light gray when available
              borderRadius: '2px',
              transition: 'background-color 0.3s ease',
              marginLeft: index > 0 ? '16px' : '0', // Add spacing between boxes
            }}
          />
        );
      })}
    </div>
  );
}
