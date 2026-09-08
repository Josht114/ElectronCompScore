# CompScoreApp (Electron)

A desktop competition scoring app for grappling matches: a 5-minute countdown
timer with color-coded phases, red/blue score tracking with point-value
buttons, negative points, and a reset. This is an Electron port of the
original C# WinForms app.

## Prerequisites

- [Node.js](https://nodejs.org) (LTS version), which includes `npm`

Check you have them installed:
```
node -v
npm -v
```

## Setup

From inside this folder:
```
npm install
```

## Run the app

```
npm start
```

This launches the app in a maximized window.

## Build an installer

```
npm run dist
```

This uses `electron-builder` (already configured in `package.json`) to produce
an installer for your current platform:
- Windows: `.exe` (NSIS installer)
- macOS: `.dmg`
- Linux: `.AppImage`

Output goes into a `dist/` folder.

## Project structure

```
electron-compscore/
├── main.js         # Electron main process (creates the window)
├── preload.js      # Preload script (contextIsolation bridge, currently unused)
├── index.html      # App layout
├── styles.css      # App styling and timer color phases
├── renderer.js     # Timer, scoring, and button logic
├── assets/
│   └── icon.ico    # App icon
└── package.json
```

## Features

- 5:00 countdown timer, background changes phase as time runs low:
  neutral → green (halfway) → blue (<30s) → orange (<10s) → red + audible
  alert at 0
- Independent red/blue score totals
- Point buttons worth 1–6 points per side, labeled with the corresponding
  grappling actions (Re-guard, Pass, etc.)
- Negative-point button per side
- Reset button clears scores, timer, and background color

## Notes on the conversion from the original WinForms app

- The original played `c:\Windows\Media\chimes.wav` when time expired, which
  only exists on Windows. This version generates a short tone with the Web
  Audio API instead, so it works on Windows, macOS, and Linux.
- Layout is sized using viewport-relative units so it fills the screen
  correctly at any window size or aspect ratio without clipping.
