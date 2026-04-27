import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift (Algorithmic)',
    artist: 'AI Synth Helix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12', // just visually
  },
  {
    id: 2,
    title: 'Cyberpunk Run',
    artist: 'AI Synth Helix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'Retrograde Protocol',
    artist: 'AI Synth Helix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    } else if (audioRef.current) {
       audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleAudioEnded = () => {
    nextTrack();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 w-full">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleAudioEnded}
      />

      <div className="flex items-center gap-4 sm:w-64 flex-shrink-0">
        <div className="w-10 h-10 bg-[#00f3ff] rounded flex-shrink-0 flex items-center justify-center relative overflow-hidden group shadow-[0_0_10px_#00f3ff]">
          {isPlaying ? (
             <div className="absolute inset-0 flex items-end justify-center gap-[2px] p-2 opacity-80 mix-blend-multiply">
               {[...Array(3)].map((_, i) => (
                 <div 
                   key={i} 
                   className="w-1 bg-black animate-pulse origin-bottom"
                   style={{
                     height: `${Math.random() * 80 + 20}%`,
                     animationDuration: `${Math.random() * 0.5 + 0.3}s`
                   }}
                 />
               ))}
             </div>
          ) : (
             <div className="w-4 h-4 bg-black rotate-45"></div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate text-white uppercase font-sans tracking-wide">{currentTrack.title}</p>
          <p className="text-[10px] text-white/50 truncate font-mono uppercase">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col gap-2">
        <div className="flex justify-center items-center gap-8">
          <button onClick={prevTrack} className="text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#00f3ff] hover:shadow-[0_0_15px_#00f3ff] transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono opacity-50 w-8 text-right">
            {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}
          </span>
          <div 
            className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
            onClick={seek}
          >
            <div 
              className="h-full bg-[#ff00ff] shadow-[0_0_8px_#ff00ff] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-mono opacity-50 w-8">
             {currentTrack.duration}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:w-48 justify-end hidden md:flex">
        <span className="text-[10px] font-mono opacity-50">VOL</span>
        <div className="w-24 h-1 bg-white/10 rounded-full">
          <div className="w-3/4 h-full bg-[#00f3ff] shadow-[0_0_5px_#00f3ff]"></div>
        </div>
      </div>
    </div>
  );
}
