# Traffic-Pulse Backend 🚦

Backend API for the Traffic-Pulse AI traffic optimization system.

## Features

- **Video Upload API**: Handle traffic video uploads with ambulance direction
- **Real-time Simulation**: WebSocket-based live traffic simulation
- **Traffic Analysis**: Process video data for pattern recognition
- **RESTful API**: Clean endpoints for frontend integration

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:3001`

## API Endpoints

### Video Upload
- `POST /api/upload-video` - Upload traffic video with ambulance direction

### Simulation Control
- `POST /api/simulation/start` - Start traffic simulation
- `POST /api/simulation/pause` - Pause simulation
- `POST /api/simulation/reset` - Reset simulation state
- `GET /api/simulation/state` - Get current simulation data

### WebSocket Events
- `simulationStateChanged` - Real-time simulation updates

## Tech Stack

- **Node.js** with Express framework
- **Socket.IO** for real-time communication
- **Multer** for file upload handling
- **CORS** enabled for frontend integration