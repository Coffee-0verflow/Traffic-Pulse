// Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  Zap,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Video,
  X,
} from "lucide-react";

export default function Dashboard({ onBack }) {
  const [isRunning, setIsRunning] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [avgWaitTime, setAvgWaitTime] = useState(45.2);
  const [emergencyDelay, setEmergencyDelay] = useState(100);
  const [throughput, setThroughput] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [intersections, setIntersections] = useState([
    { id: 1, name: "Main St & 1st Ave", signal: "green", queue: 12, waiting: 23, x: 30, y: 30 },
    { id: 2, name: "Main St & 2nd Ave", signal: "red", queue: 8, waiting: 34, x: 50, y: 30 },
    { id: 3, name: "1st Ave & Oak St", signal: "yellow", queue: 15, waiting: 28, x: 30, y: 60 },
    { id: 4, name: "2nd Ave & Oak St", signal: "green", queue: 6, waiting: 18, x: 50, y: 60 },
  ]);

  const [metrics, setMetrics] = useState({
    waitTimeHistory: Array(20).fill(45),
    emergencyHistory: Array(20).fill(100),
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setEpisode((prev) => {
        const newEp = prev + 1;

        if (newEp % 5 === 0) {
          setAvgWaitTime((p) => Math.max(18, p - Math.random() * 2));
          setEmergencyDelay((p) => Math.max(35, p - Math.random() * 5));
          setThroughput((p) => Math.min(95, p + Math.random() * 3));

          setMetrics((pm) => ({
            waitTimeHistory: [...pm.waitTimeHistory.slice(1), avgWaitTime],
            emergencyHistory: [...pm.emergencyHistory.slice(1), emergencyDelay],
          }));
        }

        setIntersections((prevInts) =>
          prevInts.map((int) => {
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
          })
        );

        return newEp > 500 ? 500 : newEp;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, avgWaitTime, emergencyDelay]);

  const handleReset = () => {
    setIsRunning(false);
    setEpisode(0);
    setAvgWaitTime(45.2);
    setEmergencyDelay(100);
    setThroughput(0);
    setMetrics({
      waitTimeHistory: Array(20).fill(45),
      emergencyHistory: Array(20).fill(100),
    });
  };

  const emergencyReduction = (((100 - emergencyDelay) / 100) * 100).toFixed(1);
  const waitTimeReduction = (((45.2 - avgWaitTime) / 45.2) * 100).toFixed(1);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    if (videoFile) {
      setUploadedVideo({
        file: videoFile,
        url: URL.createObjectURL(videoFile),
        name: videoFile.name
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name
      });
    }
  };

  const removeVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.url);
      setUploadedVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center relative">
          <button
            onClick={onBack}
            className="absolute top-0 left-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
          >
            ← Back
          </button>

          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-cyan-400" strokeWidth={2.5} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Traffic-Pulse
            </h1>
          </div>

          <p className="text-slate-300 text-lg">AI-Powered Signal Optimization System</p>

          <div className="mt-2 inline-block px-4 py-1 bg-red-500/15 border border-red-500/40 rounded-full backdrop-blur-md">
            <span className="text-red-300 font-semibold text-sm">Priority: High - URBN-99</span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-cyan-300">Control Center</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isRunning ? "Pause" : "Start"} Simulation
              </button>

              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">Learning Progress</span>
              <span className="text-cyan-300 font-bold text-lg">{episode} / 500 episodes</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${(episode / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-cyan-300" />
              <TrendingDown className="w-6 h-6 text-green-300" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgWaitTime.toFixed(1)}s</div>
            <div className="text-sm text-slate-300 mb-2">Avg Wait Time</div>
            <div className="text-green-300 text-sm font-semibold">↓ {waitTimeReduction}% reduction</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-8 h-8 text-red-300" />
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="text-3xl font-bold mb-1">{emergencyDelay.toFixed(0)}%</div>
            <div className="text-sm text-slate-300 mb-2">Emergency Delay</div>
            <div className="text-green-300 text-sm font-semibold">↓ {emergencyReduction}% vs baseline</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-8 h-8 text-purple-300" />
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <div className="text-3xl font-bold mb-1">{throughput.toFixed(1)}%</div>
            <div className="text-sm text-slate-300 mb-2">Throughput</div>
            <div className="text-purple-300 text-sm font-semibold">Real-time optimization</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-8 h-8 text-green-300" />
              <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
            </div>
            <div className="text-3xl font-bold mb-1">{intersections.length}</div>
            <div className="text-sm text-slate-300 mb-2">Active Intersections</div>
            <div className="text-green-300 text-sm font-semibold">Q-Learning Enabled</div>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
            <Video className="w-6 h-6" />
            Traffic Video Analysis
          </h2>
          
          {!uploadedVideo ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragOver 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-white mb-2">
                Drop your traffic video here
              </p>
              <p className="text-slate-300 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold cursor-pointer transition-all"
              >
                Select Video File
              </label>
            </div>
          ) : (
            <div className="bg-black/40 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-cyan-300" />
                  <span className="font-semibold text-white">{uploadedVideo.name}</span>
                </div>
                <button
                  onClick={removeVideo}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-red-300" />
                </button>
              </div>
              <video
                src={uploadedVideo.url}
                controls
                className="w-full max-h-64 rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all">
                  Analyze Traffic
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all">
                  Extract Patterns
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Network */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Traffic Network View
            </h3>

            <div className="relative bg-black/40 rounded-xl p-8 h-96 border border-white/10">
              {intersections.map((int) => (
                <div
                  key={int.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${int.x}%`, top: `${int.y}%` }}
                >
                  <div className="relative group cursor-pointer">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        int.signal === "red"
                          ? "bg-red-500 shadow-red-500/40"
                          : int.signal === "yellow"
                          ? "bg-yellow-500 shadow-yellow-500/40"
                          : "bg-green-500 shadow-green-500/40"
                      } ${isRunning ? "animate-pulse" : ""}`}
                    >
                      <span className="text-2xl font-bold">{int.id}</span>
                    </div>

                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 border border-white/10 z-10 backdrop-blur-md">
                      <div className="text-xs font-semibold text-cyan-300 mb-1">{int.name}</div>
                      <div className="text-xs text-slate-200">Queue: {int.queue} vehicles</div>
                      <div className="text-xs text-slate-200">Wait: {int.waiting}s</div>
                    </div>
                  </div>
                </div>
              ))}

              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="30%" y1="30%" x2="50%" y2="30%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="30%" y1="30%" x2="30%" y2="60%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="50%" y1="30%" x2="50%" y2="60%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="30%" y1="60%" x2="50%" y2="60%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
              <TrendingDown className="w-6 h-6" />
              Performance Trends
            </h3>

            <div className="bg-black/40 rounded-xl p-4 h-96 border border-white/10 flex items-end gap-1">
              {metrics.waitTimeHistory.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                  <div
                    className="bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t transition-all duration-300"
                    style={{ height: `${(value / 50) * 100}%` }}
                  />
                  <div
                    className="bg-gradient-to-t from-red-500 to-orange-400 rounded-t transition-all duration-300"
                    style={{ height: `${metrics.emergencyHistory[i]}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-400 rounded" />
                <span className="text-sm text-slate-300">Wait Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-orange-400 rounded" />
                <span className="text-sm text-slate-300">Emergency Delay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
