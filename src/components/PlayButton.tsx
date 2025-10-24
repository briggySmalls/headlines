import { motion } from 'framer-motion';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function PlayButton({ isPlaying, onClick, disabled }: PlayButtonProps) {
  return (
    <g>
      {/* Button background circle */}
      <circle
        cx="200"
        cy="200"
        r="30"
        fill="white"
        stroke="#334155"
        strokeWidth="2"
        style={{ cursor: disabled ? 'default' : 'pointer' }}
        onClick={disabled ? undefined : onClick}
      />

      {/* Play/Pause icon */}
      {isPlaying ? (
        // Pause icon (two bars)
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <rect
            x="190"
            y="185"
            width="8"
            height="30"
            fill="#334155"
            rx="2"
            style={{ pointerEvents: 'none' }}
          />
          <rect
            x="202"
            y="185"
            width="8"
            height="30"
            fill="#334155"
            rx="2"
            style={{ pointerEvents: 'none' }}
          />
        </motion.g>
      ) : (
        // Play icon (triangle)
        <motion.path
          d="M 192 185 L 192 215 L 212 200 Z"
          fill="#334155"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}
