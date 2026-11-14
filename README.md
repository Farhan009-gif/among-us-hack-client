# 🚀 Among Us Hack Client

A mobile-first game hack client for **Among Us** — designed to look and feel like a native APK.

## Features

### Free Hacks
| Feature | Description |
|---------|-------------|
| Speed Boost | Move faster with adjustable speed (1.5x – 3x) |
| Color Swap | Change your crewmate color |
| Name Tag | Show/hide your name above character |
| Jump Bot | Auto-jump task button |

### Premium Features 🔒
| Feature | Description |
|---------|-------------|
| ESP / Fog of War | See all players through walls |
| Anti-Task | Automatically complete tasks |
| Custom Skin | Upload and equip custom skins |
| Ghost Mode | Walk through doors as ghost |
| Admin Panel | Full control over game settings |

## Quick Start

```bash
git clone https://github.com/Farhan009-gif/among-us-hack-client.git
cd among-us-hack-client
npm install
npm start
```

Open in browser on your phone for the best experience.

## Screenshots

| Dashboard | Hacks Panel | Premium |
|-----------|-------------|---------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Hacks](docs/screenshots/hacks.png) | ![Premium](docs/screenshots/premium.png) |

## Project Structure

```
among-us-hack-client/
├── index.html          # Main client UI (mobile-first)
├── css/              
│   └── style.css       # Game-dark theme & animations
├── js/
│   ├── app.js          # Core hack engine & state management
│   ├── hacks/           # Individual hack modules
│   │   ├── esp.js      ESP / Fog of War toggle
│   │   ├── speed.js    Speed boost controller
│   │   └── colors.js  Color swap logic
│   ├── premium.js     Premium gate (feature lock/unlock)
│   └── utils.js       Helpers & utilities
├── docs/
│   └── screenshots/   # App preview images
└── package.json        Dependencies & scripts
```

## License
MIT
