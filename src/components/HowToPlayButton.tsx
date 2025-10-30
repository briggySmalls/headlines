interface HowToPlayButtonProps {
  onClick: () => void;
}

export function HowToPlayButton({ onClick }: HowToPlayButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        border: '2px solid white',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label="How to play"
      title="How to play"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  );
}
