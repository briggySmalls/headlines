# Headlines

A daily BBC News app game where players guess the decade, year, and month of up to three archive news headlines.

## Basic gameplay

A new game is made available daily on the BBC News app (similar to the daily Wordle game) on a mobile phone.
The game uses a combination lock-style dial that players turn in sections to select their answers.
Players click the play button in the dial to start a BBC radio bulletin from the archive – the recording could be from any year, any station
The recording stops after one headline plays, then the player uses the dial to guess the date of the broadcast.
The combination lock comprises three concentric rings:
- Outer ring: decade
- Middle ring: year
- Inner ring: month
The player must correctly guess each ring before progressing to the next, starting from the outermost and finishing on the innermost.
If a ring is guessed correctly the player may immediately guess the next one.
If an answer is incorrect the ring flashes red and the next headline from the broadcast is queued to be played by the play button.
An answer is selected by rotating a ring with a swiping guesture to an answer segment at the 12oclock position.
The answer is submitted it by long-pressing the the answer region.
A mock up of the dial can be found at `./dial.jpeg`.

## Scoring

Players get max three headlines.
If an answer is correct the ring turns a colour corresponding to how many headlines they've heard:
- If 1, it turns gold
- If 2, it turns silver
- If 3, it turns bronze
If a player guesses a ring correctly, they immediately are able to guess the next ring.
If all are correct, the dial is solved and the game is finished.
If a mistake is made at any stage the ring flashes red.
The game ends if a player has heard three headlines and guess incorrectly.

## Technology

The app should be a browser based web application built in React, designed to be used on mobile.
The codebase is written in TypeScript.
The codebase is formatted/linted using industry standard tooling.
Dependencies are tracked using yarn.
The project should be built using Node v22

## Development

### Prerequisites
- Node v22
- yarn

### Setup
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run linter
yarn lint

# Format code
yarn format

# Type check
yarn type-check
```

## Deployment

This project is configured for deployment on Vercel.

### Initial Setup
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project"
4. Import the `headlines` repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Continuous Deployment
- Every commit to `master` branch triggers a production deployment
- Every pull request gets a preview deployment URL
- GitHub Actions CI runs on all commits to `master` and PRs (linting, type-checking, formatting)

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```
