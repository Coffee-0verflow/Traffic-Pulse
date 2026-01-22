import React from "react";
import { Activity, ArrowRight, Brain, AlertTriangle, Target } from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-wide">TRAFFIC-PULSE</span>
          </div>
          <div className="px-4 py-2 bg-red-500/15 border border-red-500/40 rounded-full backdrop-blur-md">
            <span className="text-red-300 font-semibold text-sm">
              URBN-99 | Priority: HIGH
            </span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/10 blur-3xl rounded-full" />
              <Activity
                className="relative w-24 h-24 text-cyan-400 mx-auto animate-pulse"
                strokeWidth={2}
              />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              TRAFFIC-PULSE
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light">
            AI-Powered Signal Optimization System
          </p>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Learning optimal signal patterns for 3-4 interconnected intersections,
            prioritizing emergency vehicles while reducing average wait time
          </p>

          <button
            onClick={onGetStarted}
            className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/30 flex items-center gap-3 mx-auto"
          >
            Get Started
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-cyan-400/40 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-8 h-8 text-cyan-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">Q-Learning AI</h3>
            <p className="text-slate-300 leading-relaxed">
              Simple yet powerful reinforcement learning algorithm that continuously
              improves signal timing patterns
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-red-400/40 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/15 to-orange-500/15 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-red-300">Emergency Priority</h3>
            <p className="text-slate-300 leading-relaxed">
              Reduces emergency vehicle delay by 60% compared to normal traffic flow
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-400/40 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-purple-300">Smart Coordination</h3>
            <p className="text-slate-300 leading-relaxed">
              Basic coordination between adjacent intersections for optimal traffic flow
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10">
          <h2 className="text-3xl font-bold text-center mb-10 text-cyan-300">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-cyan-300 mb-2">60%</div>
              <div className="text-slate-300 text-sm uppercase tracking-wide">
                Emergency Delay Reduction
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-green-300 mb-2">500</div>
              <div className="text-slate-300 text-sm uppercase tracking-wide">
                Training Episodes
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-purple-300 mb-2">3-4</div>
              <div className="text-slate-300 text-sm uppercase tracking-wide">
                Connected Intersections
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-orange-300 mb-2">Real-time</div>
              <div className="text-slate-300 text-sm uppercase tracking-wide">
                Signal Optimization
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
