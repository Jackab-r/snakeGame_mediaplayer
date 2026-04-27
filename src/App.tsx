import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Cpu } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0c] text-white font-sans p-4 sm:p-6 flex flex-col">
      {/* Background neon grids/glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(24,24,27,0.5)_2px,transparent_2px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#00f3ff]/30 pb-4 mb-6 z-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] uppercase flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#00f3ff]" />
            Neon Synth Serpent
          </h1>
          <span className="text-xs font-mono font-normal tracking-normal text-[#ff00ff] block mt-1 opacity-70 uppercase">SYSTEM VERSION 1.0.4 - ACTIVE</span>
        </div>
        <div className="flex gap-6 sm:gap-8 font-mono text-sm">
          <div className="text-right">
            <p className="text-[#ff00ff] opacity-50">STATUS</p>
            <p className="text-white">CONNECTED</p>
          </div>
          <div className="text-right">
            <p className="text-[#00f3ff] opacity-50">LATENCY</p>
            <p className="text-white">12ms</p>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 z-10 w-full max-w-[1400px] mx-auto">
        
        {/* Left Sidebar: Logs */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#00f3ff]/70 px-2">System Logs</h2>
          <div className="space-y-2 overflow-hidden flex-1 bg-white/5 border-l-2 border-[#ff00ff] p-4 text-xs font-mono">
             <p className="text-[#ff00ff] mb-2">[10:45:00] Boot sequence initiated...</p>
             <p className="text-white/70 tracking-tight leading-relaxed">
               {'>'} Neural audio engine connected.<br/>
               {'>'} Serpent entity ready for simulation.<br/>
               {'>'} Syncing grid to #00f3ff matrix...
             </p>
          </div>
          
          <div className="mt-auto p-4 bg-[#ff00ff]/10 rounded border border-[#ff00ff]/20">
            <p className="text-[10px] font-mono uppercase mb-2 text-[#ff00ff]">Visualizer.exe</p>
            <div className="flex items-end gap-1 h-12">
              <div className="w-full bg-[#ff00ff] h-[60%] animate-pulse"></div>
              <div className="w-full bg-[#ff00ff] h-[80%] animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-full bg-[#ff00ff] h-[40%] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-full bg-[#ff00ff] h-[100%] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-full bg-[#ff00ff] h-[70%] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-full bg-[#ff00ff] h-[50%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </aside>

        {/* Center: Snake Game Arena */}
        <section className="col-span-1 lg:col-span-6 flex flex-col relative w-full h-full min-h-[400px]">
          <SnakeGame onScoreChange={setScore} />
        </section>

        {/* Right Sidebar: Stats & Music */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-xs font-mono text-white/50 uppercase mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Match Stats
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-sm text-white/70 uppercase font-mono">Score</span>
                <span className="text-4xl font-bold text-[#39ff14] leading-none">{score.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 border-t border-white/10 pt-4 flex flex-col">
            <h3 className="text-xs font-mono text-white/50 uppercase mb-4">Controls</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center opacity-30"></div>
              <div className="aspect-square bg-white/5 border border-white/20 flex items-center justify-center text-[#00f3ff] font-bold">W</div>
              <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center opacity-30"></div>
              <div className="aspect-square bg-white/5 border border-white/20 flex items-center justify-center text-[#00f3ff] font-bold">A</div>
              <div className="aspect-square bg-white/5 border border-white/20 flex items-center justify-center text-[#00f3ff] font-bold">S</div>
              <div className="aspect-square bg-white/5 border border-white/20 flex items-center justify-center text-[#00f3ff] font-bold">D</div>
            </div>
            <p className="mt-4 text-[10px] text-white/40 leading-relaxed font-mono uppercase">
              USE ARROW KEYS OR WASD TO NAVIGATE THE NEURAL GRID. DON'T HIT THE BARRIERS. SPACE TO PAUSE.
            </p>
          </div>
        </aside>
      </main>

      {/* Footer: Music Controls */}
      <footer className="w-full max-w-[1400px] mx-auto mt-6 z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
