import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'auto',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        aria-hidden="true"
      />

      {/* Full-screen container to center the panel */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <DialogPanel
          style={{
            width: '100%',
            maxWidth: '28rem',
            borderRadius: '1rem',
            backgroundColor: '#111827',
            color: 'white',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                }}
                aria-label="Close"
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
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              {/* Content */}
              <DialogTitle className="text-2xl font-bold mb-2">
                How To Play
              </DialogTitle>

              <p className="text-gray-300 mb-4">
                Guess when the BBC headline was broadcast
              </p>

              <div className="space-y-4 text-sm">
                {/* Instructions */}
                <div>
                  <h3 className="font-semibold mb-2 text-base">How to Play:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2">▶️ </span>
                      <span>Press play to hear a BBC archive headline</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">↔️ </span>
                      <span>Swipe or use arrow keys to rotate rings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">👆 </span>
                      <span>Click the submit button to lock in your answer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🎯 </span>
                      <span>Guess decade → year → month in order</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🎧 </span>
                      <span>You have 3 headlines to solve the puzzle</span>
                    </li>
                  </ul>
                </div>

                {/* Scoring */}
                <div>
                  <h3 className="font-semibold mb-2 text-base">Scoring:</h3>
                  <ul className="space-y-1 text-gray-300">
                    <li>1 headline: Gold 🥇</li>
                    <li>2 headlines: Silver 🥈</li>
                    <li>3 headlines: Bronze 🥉</li>
                  </ul>
                </div>
              </div>

              {/* Close button at bottom */}
              <button
                onClick={onClose}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
              >
                Got it!
              </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
