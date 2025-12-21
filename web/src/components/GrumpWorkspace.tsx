import React, { useState, useEffect, useRef } from 'react';
import './GrumpWorkspace.css';

interface GrumpWorkspaceProps {
  animation?: {
    name?: string;
    frames: (string | React.ReactNode)[];
    fps?: number;
  } | null;
  status?: 'idle' | 'working' | 'rendering' | 'done';
  progress?: number;
  currentTask?: string;
  onExport?: () => void;
  onRequestAnimation?: () => void;
}

export default function GrumpWorkspace({ 
  animation = null,
  status = 'idle',
  progress = 0,
  currentTask = '',
  onExport
}: GrumpWorkspaceProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loopMode, setLoopMode] = useState<'loop' | 'pingpong' | 'once'>('loop');
  const [direction, setDirection] = useState(1); // 1 or -1 for pingpong
  const [zoom, setZoom] = useState(1);
  const [showOnionSkin, setShowOnionSkin] = useState(false);
  const [onionSkinFrames, setOnionSkinFrames] = useState(2);
  const [showGrid, setShowGrid] = useState(false);
  const [bgMode, setBgMode] = useState<'checker' | 'dark' | 'light'>('checker');
  const [showFrameInfo, setShowFrameInfo] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Frame advancement with loop modes
  useEffect(() => {
    if (!animation?.frames?.length || !isPlaying || status !== 'done') return;
    
    const frames = animation.frames;
    const effectiveFps = (animation.fps || 12) * playbackSpeed;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        if (loopMode === 'loop') {
          return (prev + 1) % frames.length;
        } else if (loopMode === 'pingpong') {
          const next = prev + direction;
          if (next >= frames.length - 1) {
            setDirection(-1);
            return frames.length - 1;
          } else if (next <= 0) {
            setDirection(1);
            return 0;
          }
          return next;
        } else { // once
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        }
      });
    }, 1000 / effectiveFps);
    
    return () => clearInterval(interval);
  }, [animation, isPlaying, status, playbackSpeed, loopMode, direction]);

  // Reset on new animation
  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
    setDirection(1);
  }, [animation]);

  // Scroll timeline to current frame
  useEffect(() => {
    if (timelineRef.current && animation?.frames?.length) {
      const frameWidth = 52; // thumbnail width + gap
      const scrollPos = currentFrame * frameWidth - timelineRef.current.offsetWidth / 2 + frameWidth / 2;
      timelineRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [currentFrame, animation]);

  const workingStages = [
    { threshold: 0, label: 'Planning...', icon: '🤔' },
    { threshold: 15, label: 'Roughing keyframes...', icon: '✏️' },
    { threshold: 35, label: 'Adding breakdowns...', icon: '🖊️' },
    { threshold: 55, label: 'Cleanup pass...', icon: '🧹' },
    { threshold: 75, label: 'Final details...', icon: '✨' },
    { threshold: 90, label: 'Almost there...', icon: '🎬' }
  ];

  const getCurrentStage = () => {
    for (let i = workingStages.length - 1; i >= 0; i--) {
      if (progress >= workingStages[i].threshold) return workingStages[i];
    }
    return workingStages[0];
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (bgMode === 'checker') {
      return {
        backgroundImage: `
          linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
          linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #e0e0e0 75%), 
          linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
        `,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        backgroundColor: '#f5f5f5'
      };
    } else if (bgMode === 'dark') {
      return { backgroundColor: '#1a1a1a' };
    } else {
      return { backgroundColor: '#ffffff' };
    }
  };

  const formatTime = (frames: number, fps: number) => {
    const seconds = frames / fps;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`;
  };

  return (
    <div className="grump-workspace">
      
      {/* Header Bar */}
      <div className="workspace-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Window controls */}
          <div className="workspace-window-controls">
            <div className="window-dot red" />
            <div className="window-dot yellow" />
            <div className="window-dot green" />
          </div>

          {/* Title */}
          <div className="workspace-title">
            <span className="workspace-title-text">
              {animation?.name || 'Grump Workspace'}
            </span>
            {status === 'done' && animation && (
              <span className="workspace-title-badge">
                {animation.frames.length}f @ {animation.fps || 12}fps
              </span>
            )}
          </div>

          {/* Status indicator */}
          <div className="workspace-status">
            <div className={`workspace-status-dot ${status}`} />
            <span className="workspace-status-text">{status}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {status === 'done' && animation && (
        <div className="px-4 py-2 border-b border-white/30 bg-white/10">
          <div className="flex items-center justify-between">
            {/* Left tools */}
            <div className="flex items-center gap-1">
              {/* Zoom controls */}
              <div className="flex items-center bg-white/40 rounded-lg p-0.5">
                <button 
                  onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white/60 rounded-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xs text-gray-600 w-12 text-center font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <button 
                  onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white/60 rounded-md transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  onClick={() => setZoom(1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white/60 rounded-md transition-all text-xs font-medium"
                >
                  1:1
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300/50 mx-1" />

              {/* View toggles */}
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  showGrid ? 'bg-orange-400/80 text-white' : 'bg-white/40 text-gray-600 hover:bg-white/60'
                }`}
                title="Toggle Grid"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={1.5} d="M4 4h16v16H4V4zm0 4h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16" />
                </svg>
              </button>

              <button 
                onClick={() => setShowOnionSkin(!showOnionSkin)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  showOnionSkin ? 'bg-orange-400/80 text-white' : 'bg-white/40 text-gray-600 hover:bg-white/60'
                }`}
                title="Toggle Onion Skin"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
                  <circle cx="12" cy="12" r="5" strokeWidth={1.5} opacity={0.5} />
                  <circle cx="12" cy="12" r="2" strokeWidth={1.5} opacity={0.25} />
                </svg>
              </button>

              {showOnionSkin && (
                <div className="flex items-center bg-white/40 rounded-lg px-2 py-1 ml-1">
                  <span className="text-xs text-gray-500 mr-2">Frames:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={onionSkinFrames}
                    onChange={(e) => setOnionSkinFrames(parseInt(e.target.value))}
                    className="w-16 h-1 accent-orange-400"
                  />
                  <span className="text-xs text-gray-600 ml-2 w-3">{onionSkinFrames}</span>
                </div>
              )}
            </div>

            {/* Right tools */}
            <div className="flex items-center gap-1">
              {/* Background mode */}
              <div className="flex items-center bg-white/40 rounded-lg p-0.5">
                {[
                  { mode: 'checker' as const, icon: '▦' },
                  { mode: 'light' as const, icon: '○' },
                  { mode: 'dark' as const, icon: '●' }
                ].map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setBgMode(mode)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-all text-sm ${
                      bgMode === mode ? 'bg-white/80 shadow-sm' : 'text-gray-500 hover:bg-white/40'
                    }`}
                    title={`${mode} background`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-gray-300/50 mx-1" />

              {/* Export */}
              {onExport && (
                <button 
                  onClick={onExport}
                  className="h-8 px-3 flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-medium rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Stage */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div 
          className="relative rounded-2xl border border-white/40 shadow-inner overflow-hidden transition-all"
          style={{
            width: `min(100%, ${256 * zoom}px)`,
            aspectRatio: '1',
            ...getBackgroundStyle()
          }}
        >
          {/* Grid overlay */}
          {showGrid && status === 'done' && (
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />
          )}

          {/* Center guides */}
          {showGrid && status === 'done' && (
            <>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-400/30 z-10" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/30 z-10" />
            </>
          )}
          
          {/* IDLE STATE */}
          {status === 'idle' && !animation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                  <span className="text-4xl opacity-40">✏️</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Canvas Empty</p>
                <p className="text-xs text-gray-400">Ask Grump to animate something</p>
              </div>
            </div>
          )}

          {/* WORKING STATE */}
          {status === 'working' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="text-center p-6">
                {/* Animated pencil */}
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl animate-bounce">{getCurrentStage().icon}</span>
                  </div>
                  {/* Circular progress */}
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={276.46}
                      strokeDashoffset={276.46 * (1 - progress / 100)}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {getCurrentStage().label}
                </p>
                {currentTask && (
                  <p className="text-xs text-gray-500 mb-3">"{currentTask}"</p>
                )}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>{progress}%</span>
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RENDERING STATE */}
          {status === 'rendering' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="text-center p-6">
                <div className="flex gap-2 justify-center mb-4">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div 
                      key={i}
                      className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm"
                      style={{
                        animation: 'bounce 0.6s infinite',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-700">Rendering frames...</p>
                <p className="text-xs text-gray-400 mt-1">Preparing playback</p>
              </div>
            </div>
          )}

          {/* DONE STATE - Animation display */}
          {status === 'done' && animation && animation.frames && animation.frames.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Onion skin - previous frames */}
              {showOnionSkin && [...Array(onionSkinFrames)].map((_, i) => {
                const frameIndex = currentFrame - (i + 1);
                if (frameIndex < 0) return null;
                const opacity = 0.3 - (i * 0.08);
                return (
                  <div 
                    key={`prev-${i}`}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity }}
                  >
                    {typeof animation.frames[frameIndex] === 'string' ? (
                      <img 
                        src={animation.frames[frameIndex] as string} 
                        alt=""
                        className="max-w-full max-h-full object-contain"
                        style={{ filter: 'hue-rotate(-30deg) saturate(0.5)' }}
                      />
                    ) : animation.frames[frameIndex]}
                  </div>
                );
              })}

              {/* Onion skin - next frames */}
              {showOnionSkin && [...Array(onionSkinFrames)].map((_, i) => {
                const frameIndex = currentFrame + (i + 1);
                if (frameIndex >= animation.frames.length) return null;
                const opacity = 0.3 - (i * 0.08);
                return (
                  <div 
                    key={`next-${i}`}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity }}
                  >
                    {typeof animation.frames[frameIndex] === 'string' ? (
                      <img 
                        src={animation.frames[frameIndex] as string} 
                        alt=""
                        className="max-w-full max-h-full object-contain"
                        style={{ filter: 'hue-rotate(30deg) saturate(0.5)' }}
                      />
                    ) : animation.frames[frameIndex]}
                  </div>
                );
              })}

              {/* Current frame */}
              <div className="relative z-20 flex items-center justify-center w-full h-full">
                {typeof animation.frames[currentFrame] === 'string' ? (
                  <img 
                    src={animation.frames[currentFrame] as string} 
                    alt={`Frame ${currentFrame + 1}`}
                    className="max-w-full max-h-full object-contain"
                    draggable={false}
                  />
                ) : animation.frames[currentFrame]}
              </div>
            </div>
          )}

          {/* Frame info overlay */}
          {status === 'done' && showFrameInfo && animation && (
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-mono z-30">
              {String(currentFrame + 1).padStart(3, '0')} / {animation.frames.length}
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      {status === 'done' && animation && animation.frames && animation.frames.length > 0 && (
        <div className="border-t border-white/30 bg-white/20">
          {/* Timeline scrubber with thumbnails */}
          <div className="px-4 py-3 border-b border-white/20">
            <div 
              ref={timelineRef}
              className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              {animation.frames.map((frame, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentFrame(i);
                    setIsPlaying(false);
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentFrame 
                      ? 'border-orange-400 shadow-md scale-105' 
                      : 'border-white/40 hover:border-white/70'
                  }`}
                >
                  {typeof frame === 'string' ? (
                    <img src={frame} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      {i + 1}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main controls */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Playback buttons */}
              <div className="flex items-center gap-1">
                {/* First frame */}
                <button 
                  onClick={() => { setCurrentFrame(0); setIsPlaying(false); }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/40 text-gray-600 hover:bg-white/60 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm10 0l-8 6 8 6V6z" />
                  </svg>
                </button>

                {/* Previous frame */}
                <button 
                  onClick={() => { 
                    if (!animation) return;
                    setCurrentFrame(prev => prev === 0 ? animation.frames.length - 1 : prev - 1);
                    setIsPlaying(false);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/40 text-gray-600 hover:bg-white/60 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Play/Pause */}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Next frame */}
                <button 
                  onClick={() => {
                    if (!animation) return;
                    setCurrentFrame(prev => (prev + 1) % animation.frames.length);
                    setIsPlaying(false);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/40 text-gray-600 hover:bg-white/60 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6h2v12h-2zm-10 0v12l8.5-6z" />
                  </svg>
                </button>

                {/* Last frame */}
                <button 
                  onClick={() => { 
                    if (!animation) return;
                    setCurrentFrame(animation.frames.length - 1); 
                    setIsPlaying(false); 
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/40 text-gray-600 hover:bg-white/60 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6h2v12h-2zM8 6l8 6-8 6V6z" />
                  </svg>
                </button>
              </div>

              {/* Time display */}
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600 bg-white/40 px-3 py-1.5 rounded-lg">
                <span>{formatTime(currentFrame + 1, animation.fps || 12)}</span>
                <span className="text-gray-400">/</span>
                <span>{formatTime(animation.frames.length, animation.fps || 12)}</span>
              </div>

              <div className="flex-1" />

              {/* Speed control */}
              <div className="flex items-center gap-2 bg-white/40 rounded-lg px-3 py-1.5">
                <span className="text-xs text-gray-500">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="text-xs text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={0.25}>0.25x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>

              {/* Loop mode */}
              <div className="flex items-center bg-white/40 rounded-lg p-0.5">
                {[
                  { mode: 'loop' as const, icon: '🔁', title: 'Loop' },
                  { mode: 'pingpong' as const, icon: '🔄', title: 'Ping Pong' },
                  { mode: 'once' as const, icon: '➡️', title: 'Play Once' }
                ].map(({ mode, icon, title }) => (
                  <button
                    key={mode}
                    onClick={() => setLoopMode(mode)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all text-sm ${
                      loopMode === mode ? 'bg-white/80 shadow-sm' : 'hover:bg-white/40'
                    }`}
                    title={title}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Frame info toggle */}
              <button
                onClick={() => setShowFrameInfo(!showFrameInfo)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                  showFrameInfo ? 'bg-orange-400/80 text-white' : 'bg-white/40 text-gray-600 hover:bg-white/60'
                }`}
                title="Toggle frame counter"
              >
                <span className="text-xs font-bold">#</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - idle hints */}
      {status === 'idle' && !animation && (
        <div className="px-5 py-4 border-t border-white/30 bg-white/10">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Try: "Make a walk cycle" • "Animate a bouncing ball" • "Show squash and stretch"
          </p>
        </div>
      )}

      {/* Bounce animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

