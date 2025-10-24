# Headlines Game - Implementation Plan

## Overview
Building a daily BBC News game where players guess the decade, year, and month of archive news headlines using a combination lock-style dial interface.

## Technology Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: yarn
- **Node Version**: v22
- **State Management**: Context API + useReducer
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Component Library**: None (custom components)
- **Utilities**: clsx, tailwind-merge
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## TypeScript Configuration
- Strict mode enabled
- All recommended rules enabled

---

## Phase 0: Deployment & CI Setup

**Tasks:**
1. Create GitHub Actions workflow at `.github/workflows/ci.yml`:
   - Run on push to `master` and all PRs
   - Install Node v22 and dependencies
   - Run `yarn lint` (fail on errors)
   - Run `yarn type-check` (fail on errors)
   - Run `yarn format --check` (fail on errors)
2. Add Vercel configuration file `vercel.json`:
   - Specify build command: `yarn build`
   - Specify output directory: `dist`
   - Framework: `vite`
3. Create `.vercelignore` file to exclude unnecessary files
4. Add deployment instructions to README:
   - Connect GitHub repo to Vercel via dashboard
   - Auto-deploy on commits to `master`
   - Preview deployments for PRs
5. Set up basic "Hello World" index.html for initial deployment test

**Deliverables:**
- `.github/workflows/ci.yml` configured
- `vercel.json` configured
- CI pipeline runs on master and PRs
- CI fails on lint/type/format errors
- Deployment configuration ready for Vercel

**End of Phase:** Verify CI workflow passes (once Phase 1 provides linting tools)

---

## Phase 1: Project Initialization

**Tasks:**
1. Initialize Vite + React + TypeScript project with Node v22
2. Install dependencies: Tailwind CSS, Framer Motion, clsx, tailwind-merge
3. Configure TypeScript with strict mode + all recommended rules
4. Configure Tailwind CSS with mobile-first breakpoints
5. Set up ESLint + Prettier for formatting/linting
6. Add package.json scripts:
   - `dev` - Start development server
   - `build` - Build for production
   - `lint` - Run ESLint
   - `format` - Run Prettier
   - `type-check` - Run TypeScript compiler check

**Deliverables:**
- Working Vite project structure
- All dependencies installed
- Linting/formatting configured
- All scripts functional

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 2: Project Structure & Types

**Tasks:**
1. Create folder structure:
   - `/src/components` - React components
   - `/src/hooks` - Custom React hooks
   - `/src/utils` - Utility functions
   - `/src/types` - TypeScript type definitions
   - `/src/data` - Mock game data
   - `/src/context` - React Context for state management
2. Define TypeScript types in `/src/types/game.ts`:
   - `GameState` - Main game state
   - `RingState` - Individual ring state
   - `DailyGame` - Daily game data structure
   - `RingType` - 'decade' | 'year' | 'month'
   - `GameStatus` - 'not_started' | 'playing' | 'won' | 'lost'
   - All with ISO date format (YYYY-MM-DD)
3. Create mock game data in `/src/data/mockGame.ts`:
   - Game ID: "1995-08-15"
   - Answer: { decade: "1990s", year: "1995", month: "Aug" }
   - Audio paths: `./assets/headlines/1995-08/1995-08_[1-3].mp3`
4. Set up game reducer in `/src/context/gameReducer.ts`:
   - Actions: ROTATE_RING, SUBMIT_GUESS, PLAY_HEADLINE, LOCK_RING, etc.
   - Initial state factory
5. Create GameContext in `/src/context/GameContext.tsx`:
   - Context provider with useReducer
   - Custom useGame hook for consuming context

**Deliverables:**
- Complete folder structure
- All TypeScript types defined
- Mock data created
- Game reducer with all actions
- GameContext provider ready

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 3: Core Dial Component (SVG)

**Tasks:**
1. Build `DialInterface` component with 3 concentric SVG rings
2. Create `Ring` component with segment calculation:
   - Decade: 9 segments (1940s, 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s)
   - Year: 10 segments (dynamic based on decade, e.g., 1990-1999)
   - Month: 12 segments (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
3. Add `AnswerMarker` component at 12 o'clock position
4. Implement dynamic year ring that updates based on selected decade
5. Apply heavy blur effect (`filter: blur(8px)`) to year/month rings until unlocked
6. Position text on ring segments with proper rotation

**Deliverables:**
- DialInterface component rendering 3 rings
- Proper segment calculation and text positioning
- Blur effects on locked rings
- 12 o'clock answer marker visible

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 4: Touch Interactions

**Tasks:**
1. Implement Framer Motion drag gestures for ring rotation
2. Add rotation calculation based on drag delta
3. Create snap-to-segment behavior when drag ends
4. Implement long-press handler (500ms duration) at 12 o'clock position
5. Add circular progress indicator during long-press
6. Add hit detection to determine which ring user is interacting with
7. Disable interaction on locked rings

**Deliverables:**
- Smooth swipe-to-rotate on all unlocked rings
- Snap-to-segment animation
- Long-press submission with visual feedback
- Only active ring responds to touch

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 5: Game Logic

**Tasks:**
1. Implement answer validation logic:
   - Check if submitted value matches correct answer
   - Progress through sequence: decade → year → month
2. Add ring locking logic:
   - Prevent rotation after correct guess
   - Store locked state
3. Implement color application based on `headlinesHeard`:
   - 1 headline: gold (#FFD700)
   - 2 headlines: silver (#C0C0C0)
   - 3 headlines: bronze (#CD7F32)
   - Smooth transition (300ms)
4. Add red flash animation on incorrect guess (200ms pulse)
5. Handle headline progression:
   - First incorrect guess immediately queues next headline
   - Increment `currentHeadlineIndex`
6. Implement win/lose conditions:
   - Win: All 3 rings locked correctly
   - Lose: 3 headlines heard + incorrect guess

**Deliverables:**
- Full game logic working end-to-end
- Correct/incorrect feedback
- Color transitions on correct guesses
- Red flash on incorrect guesses
- Win/lose detection

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 6: Audio Integration

**Tasks:**
1. Create `AudioPlayer` component using HTMLAudioElement
2. Build `PlayButton` component for center of dial
3. Load 3 audio files from `./assets/headlines/1995-08/`:
   - `1995-08_1.mp3`
   - `1995-08_2.mp3`
   - `1995-08_3.mp3`
4. Implement play/pause/replay functionality:
   - First press plays current headline
   - Subsequent presses replay same headline
   - Progress to next headline only on incorrect guess
5. Add headline counter UI displaying "1/3", "2/3", "3/3"
6. Increment counter when headline is played (not on replay)

**Deliverables:**
- Working audio playback
- Play button in center of dial
- Headline counter visible
- Replay functionality working

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 7: Game Over & Persistence

**Tasks:**
1. Replace play button with answer display on game completion:
   - Show: Decade, Year, Month in center
2. Implement LocalStorage persistence:
   - Save key: `headlines-game-state`
   - Save on every state change (after each action)
   - Store: `{ dailyGameId, gameState, timestamp }`
3. Add resume functionality:
   - On app load, check localStorage
   - If `dailyGameId === "1995-08-15"`, restore state
   - Otherwise, start fresh game
4. Clear localStorage if different daily game

**Deliverables:**
- Game over screen showing answer
- State persisted to localStorage
- Resume working correctly
- Fresh game on new day

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase 8: Polish & Testing

**Tasks:**
1. Add smooth color transitions (300ms ease-in-out)
2. Refine animations:
   - Ring rotation easing
   - Flash effects timing
   - Blur removal transition
3. Test touch interactions in mobile viewport (375px width)
4. Verify all game flows:
   - Win scenario (all correct)
   - Lose scenario (3 incorrect)
   - Resume mid-game
   - Replay headlines
5. Format and lint entire codebase one final time
6. Test in actual mobile browser (iOS Safari, Chrome Android)

**Deliverables:**
- Polished animations
- All game flows tested and working
- Mobile-optimized
- Clean, formatted codebase

**End of Phase:** Run `yarn format` and `yarn lint`, fix all issues

---

## Phase Approval Process

After completing each phase:
1. Run `yarn format` to format all code
2. Run `yarn lint` and fix all issues automatically
3. Commit work (if applicable)
4. Wait for approval before proceeding to next phase

---

## Notes

- Mock game always uses "1995-08-15" data
- Audio files located at `./assets/headlines/1995-08/`
- Heavy blur (8px) for unrevealed rings
- ISO date format throughout: YYYY-MM-DD
- Decade range: 1940s - 2020s (9 segments)
