const express = require('express');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { PythonShell } = require('python-shell');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Traffic simulation state
let simulationState = {
  isRunning: false,
  episode: 0,
  avgWaitTime: 45.2,
  emergencyDelay: 100,
  throughput: 0,
  intersections: [
    { id: 1, name: "Main St & 1st Ave", signal: "green", queue: 12, waiting: 23, x: 30, y: 30 },
    { id: 2, name: "Main St & 2nd Ave", signal: "red", queue: 8, waiting: 34, x: 50, y: 30 },
    { id: 3, name: "1st Ave & Oak St", signal: "yellow", queue: 15, waiting: 28, x: 30, y: 60 },
    { id: 4, name: "2nd Ave & Oak St", signal: "green", queue: 6, waiting: 18, x: 50, y: 60 },
  ]
};

// API Routes
app.post('/api/upload-video', upload.single('video'), (req, res) => {
  try {
    const { ambulanceDirection } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      videoId: req.file.filename,
      ambulanceDirection: ambulanceDirection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze-video', (req, res) => {
  const { videoId, ambulanceDirection } = req.body;
  
  if (!videoId || !ambulanceDirection) {
    return res.status(400).json({ error: 'Missing videoId or ambulanceDirection' });
  }

  const videoPath = path.join(__dirname, 'uploads', videoId);
  
  const options = {
    mode: 'text',
    pythonPath: 'python3',
    pythonOptions: ['-u'],
    scriptPath: __dirname,
    args: [videoPath, ambulanceDirection]
  };

  PythonShell.run('yolo_analyzer.py', options, (err, results) => {
    if (err) {
      console.error('YOLO Analysis Error:', err);
      return res.status(500).json({ error: 'Video analysis failed' });
    }

    try {
      const analysisResult = JSON.parse(results[0]);
      
      if (analysisResult.error) {
        return res.status(500).json({ error: analysisResult.error });
      }

      res.json({
        success: true,
        message: 'Video analyzed successfully',
        data: {
          videoId: videoId,
          ambulanceDirection: ambulanceDirection,
          ...analysisResult,
          timestamp: new Date().toISOString()
        }
      });
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      res.status(500).json({ error: 'Failed to parse analysis results' });
    }
  });
});

app.post('/api/simulation/start', (req, res) => {
  simulationState.isRunning = true;
  io.emit('simulationStateChanged', simulationState);
  res.json({ success: true, message: 'Simulation started' });
});

app.post('/api/simulation/pause', (req, res) => {
  simulationState.isRunning = false;
  io.emit('simulationStateChanged', simulationState);
  res.json({ success: true, message: 'Simulation paused' });
});

app.post('/api/simulation/reset', (req, res) => {
  simulationState = {
    ...simulationState,
    isRunning: false,
    episode: 0,
    avgWaitTime: 45.2,
    emergencyDelay: 100,
    throughput: 0
  };
  io.emit('simulationStateChanged', simulationState);
  res.json({ success: true, message: 'Simulation reset' });
});

app.get('/api/simulation/state', (req, res) => {
  res.json(simulationState);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.emit('simulationStateChanged', simulationState);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulation loop
setInterval(() => {
  if (simulationState.isRunning) {
    simulationState.episode += 1;
    
    if (simulationState.episode % 5 === 0) {
      simulationState.avgWaitTime = Math.max(18, simulationState.avgWaitTime - Math.random() * 2);
      simulationState.emergencyDelay = Math.max(35, simulationState.emergencyDelay - Math.random() * 5);
      simulationState.throughput = Math.min(95, simulationState.throughput + Math.random() * 3);
    }

    // Update intersections
    simulationState.intersections = simulationState.intersections.map(int => {
      if (Math.random() > 0.7) {
        const signals = ["red", "yellow", "green"];
        return {
          ...int,
          signal: signals[Math.floor(Math.random() * signals.length)],
          queue: Math.floor(Math.random() * 20),
          waiting: Math.floor(Math.random() * 40),
        };
      }
      return int;
    });

    io.emit('simulationStateChanged', simulationState);
    
    if (simulationState.episode >= 500) {
      simulationState.isRunning = false;
    }
  }
}, 200);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚦 Traffic-Pulse Backend running on port ${PORT}`);
});