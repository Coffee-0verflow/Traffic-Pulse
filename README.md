# Traffic-Pulse Frontend 🚦

*The dashboard that makes traffic lights smarter*

This is the React frontend for Traffic-Pulse - an AI-powered traffic signal optimization system. Built with modern web technologies to provide a sleek, real-time dashboard for monitoring and controlling traffic flow.

## Features

- **Real-time Dashboard**: Live traffic network visualization with interactive controls
- **Video Upload**: Drag & drop interface for traffic video analysis
- **AI Simulation**: Watch Q-learning algorithms optimize traffic in real-time
- **Performance Metrics**: Track wait times, emergency delays, and throughput
- **Responsive Design**: Works great on desktop and mobile devices

## Tech Stack

- **React 18** with hooks for state management
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful, consistent icons
- **Modern JavaScript** (ES6+) with clean, readable code

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Then open `http://localhost:5173` and start optimizing traffic!

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx    # Main dashboard with all features
│   └── LandingPage.jsx  # Welcome page
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

## Development

The app uses Vite's hot module replacement, so changes appear instantly. The dashboard simulates real traffic data and learning progress - perfect for demos and development.

---

*Part of the Traffic-Pulse ecosystem - making cities smarter, one intersection at a time.*