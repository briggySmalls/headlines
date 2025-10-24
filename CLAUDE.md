# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Headlines is a daily BBC News app game where players guess the decade, year, and month of archive news headlines. The game features a combination lock-style dial interface with three concentric rings that players rotate and lock in to submit their guesses.

## Technology Stack

- **Framework**: React
- **Language**: TypeScript
- **Package Manager**: yarn
- **Node Version**: v22
- **Target Platform**: Browser-based web application, mobile-first design

## Core Game Mechanics

### The Dial Interface

The combination lock comprises three concentric rings that must be guessed sequentially from outer to inner:
- **Outer ring**: Decade
- **Middle ring**: Year
- **Inner ring**: Month

Players interact with the dial by:
- Rotating rings via swipe gesture to position an answer at 12 o'clock
- Long-pressing the answer region to submit
- Using a play button to hear BBC radio bulletins from the archive

### Game Flow

1. Player clicks play button to hear one headline from an archive BBC radio bulletin
2. Player guesses the decade (outer ring) by rotating and long-pressing
3. If correct, ring turns gold/silver/bronze (based on attempts) and player proceeds to year
4. If incorrect, ring flashes red and next headline is queued
5. Process repeats for year (middle ring) and month (inner ring)
6. Maximum three headlines per game

### Scoring System

- **1 headline heard**: Gold
- **2 headlines heard**: Silver
- **3 headlines heard**: Bronze
- Game ends after 3 incorrect guesses or when all rings are solved

## Project Status

This is an early-stage project. The repository currently contains only specifications and a mockup image (`dial.jpeg`). No code implementation exists yet.

## Development Setup

Once the project is initialized with React/TypeScript:

```bash
# Install dependencies
yarn install

# Run development server
yarn start

# Run tests
yarn test

# Build for production
yarn build

# Lint code
yarn lint
```

Note: These commands assume standard Create React App or Vite setup patterns. Update this section once the project structure is established.
