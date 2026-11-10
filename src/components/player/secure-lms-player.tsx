'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Gauge,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { extractYouTubeId } from '@/lib/video-utils';

interface SecureLmsPlayerProps {
  videoUrl: string;
  title?: string;
  studentName?: string;
  studentPhone?: string;
  studentId?: string;
  poster?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
  isTheater?: boolean;
  onToggleTheater?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export function SecureLmsPlayer({
  videoUrl,
  title = 'محاضرة تعليمية',
  studentName = 'طالب أكاديمية YA7EDU',
  studentPhone = '01030370718',
  studentId = 'YA7-STU-99',
  poster,
  autoPlay = false,
  onEnded,
  className = '',
  isTheater = false,
  onToggleTheater
}: SecureLmsPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElemRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerId = useRef<string>(`ya7_yt_${Math.random().toString(36).substring(2, 9)}`);

  // Detect source type
  const youtubeId = extractYouTubeId(videoUrl);
  const isYouTube = !!youtubeId;

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  // Floating Watermark coordinates
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', left: '20%' });
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------
  // Anti-Screen-Record Floating Watermark Randomizer
  // -------------------------------------------------------------
  useEffect(() => {
    const moveWatermark = () => {
      // Random position keeping inside bounds (10% to 75%)
      const top = Math.floor(Math.random() * 65 + 10) + '%';
      const left = Math.floor(Math.random() * 65 + 10) + '%';
      const opacity = (Math.random() * 0.2 + 0.25).toFixed(2); // 0.25 to 0.45
      setWatermarkPos({ top, left });
      setWatermarkOpacity(parseFloat(opacity));
    };

    const interval = setInterval(moveWatermark, 6000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // Anti-Inspect & DevTools Trap Protection
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityToast('تم حظر فحص العناصر لحماية حقوق النشر والمحتوى الرقمي');
        return false;
      }

      // Media keyboard shortcuts when focusing player
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    const triggerSecurityToast = (msg: string) => {
      setSecurityToast(msg);
      setTimeout(() => setSecurityToast(null), 3500);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, volume]);

  // -------------------------------------------------------------
  // YouTube IFrame API Initialization
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isYouTube || !youtubeId) return;

    let pollInterval: NodeJS.Timeout | null = null;

    const initYouTubePlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch {}
        }

        ytPlayerRef.current = new window.YT.Player(ytContainerId.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 0, // HIDE YOUTUBE CONTROLS
            disablekb: 1, // DISABLE YOUTUBE SHORTCUTS
            fs: 0, // HIDE YOUTUBE FULLSCREEN
            modestbranding: 1, // REMOVE YOUTUBE LOGO
            rel: 0, // NO RELATED VIDEOS
            showinfo: 0,
            iv_load_policy: 3, // NO ANNOTATIONS
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : ''
          },
          events: {
            onReady: (event: any) => {
              const dur = event.target.getDuration();
              if (dur) setDuration(dur);
              event.target.setVolume(volume * 100);
              if (autoPlay) {
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
              if (event.data === 1) {
                setIsPlaying(true);
                setIsBuffering(false);
              } else if (event.data === 2) {
                setIsPlaying(false);
                setIsBuffering(false);
              } else if (event.data === 3) {
                setIsBuffering(true);
              } else if (event.data === 0) {
                setIsPlaying(false);
                if (onEnded) onEnded();
              }
            }
          }
        });

        // Poll current time and duration
        pollInterval = setInterval(() => {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            try {
              const cur = ytPlayerRef.current.getCurrentTime();
              const dur = ytPlayerRef.current.getDuration();
              const buf = ytPlayerRef.current.getVideoLoadedFraction();
              if (typeof cur === 'number') setCurrentTime(cur);
              if (typeof dur === 'number' && dur > 0) setDuration(dur);
              if (typeof buf === 'number') setBuffered(buf);
            } catch {}
          }
        }, 300);
      } catch (err) {
        console.error('Failed to instantiate YouTube player:', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initYouTubePlayer();
      };
    } else {
      initYouTubePlayer();
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
      }
    };
  }, [youtubeId, isYouTube]);

  // -------------------------------------------------------------
  // HTML5 Video Handlers
  // -------------------------------------------------------------
  const handleHtml5TimeUpdate = () => {
    if (videoElemRef.current) {
      setCurrentTime(videoElemRef.current.currentTime);
      if (videoElemRef.current.buffered.length > 0) {
        const bufEnd = videoElemRef.current.buffered.end(videoElemRef.current.buffered.length - 1);
        setBuffered(bufEnd / videoElemRef.current.duration);
      }
    }
  };

  const handleHtml5LoadedMetadata = () => {
    if (videoElemRef.current) {
      setDuration(videoElemRef.current.duration);
      videoElemRef.current.volume = volume;
    }
  };

  // -------------------------------------------------------------
  // Player Controls Implementation
  // -------------------------------------------------------------
  const togglePlay = () => {
    if (isYouTube && ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {}
    } else if (videoElemRef.current) {
      if (videoElemRef.current.paused) {
        videoElemRef.current.play();
        setIsPlaying(true);
      } else {
        videoElemRef.current.pause();
        setIsPlaying(false);
      }
    }
    triggerControlsVisibility();
  };

  const seek = (timeSeconds: number) => {
    const clamped = Math.max(0, Math.min(timeSeconds, duration));
    setCurrentTime(clamped);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.seekTo(clamped, true);
      } catch {}
    } else if (videoElemRef.current) {
      videoElemRef.current.currentTime = clamped;
    }
  };

  const skipTime = (deltaSeconds: number) => {
    seek(currentTime + deltaSeconds);
    triggerControlsVisibility();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(newVol * 100);
        if (newVol > 0 && ytPlayerRef.current.isMuted()) {
          ytPlayerRef.current.unMute();
        }
      } catch {}
    } else if (videoElemRef.current) {
      videoElemRef.current.volume = newVol;
      videoElemRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      handleVolumeChange(volume || 0.8);
    } else {
      setIsMuted(true);
      if (isYouTube && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.mute();
        } catch {}
      } else if (videoElemRef.current) {
        videoElemRef.current.muted = true;
      }
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    setIsSpeedMenuOpen(false);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(speed);
      } catch {}
    } else if (videoElemRef.current) {
      videoElemRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Controls auto-hide on idle
  const triggerControlsVisibility = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setIsSpeedMenuOpen(false);
      }, 3500);
    }
  }, [isPlaying]);

  const handleMouseMove = () => {
    triggerControlsVisibility();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = Math.min(buffered * 100, 100);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`relative w-full aspect-video bg-black overflow-hidden select-none group font-sans ${className}`}
      style={{ WebkitUserSelect: 'none' }}
    >
      {/* -------------------------------------------------------------
          VIDEO MOUNT AREA
         ------------------------------------------------------------- */}
      {isYouTube ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
          <div
            id={ytContainerId.current}
            className="w-[102%] h-[102%] scale-105 pointer-events-none -m-1"
          />
        </div>
      ) : (
        <video
          ref={videoElemRef}
          src={videoUrl}
          poster={poster}
          playsInline
          onTimeUpdate={handleHtml5TimeUpdate}
          onLoadedMetadata={handleHtml5LoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
          className="w-full h-full object-contain pointer-events-none"
        />
      )}

      {/* -------------------------------------------------------------
          POINTER SHIELD & CLICK INTERCEPTOR
          Completely covers YouTube iframe to block YouTube context menu,
          YouTube branding clicks, and video URL copying.
         ------------------------------------------------------------- */}
      <div
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="absolute inset-0 z-10 cursor-pointer"
        title="انقر للتشغيل / الإيقاف مؤقتاً"
      />

      {/* -------------------------------------------------------------
          ANTI-PIRACY FLOATING DYNAMIC WATERMARK
          Shows student identity floating randomly across video.
         ------------------------------------------------------------- */}
      <div
        className="absolute z-20 pointer-events-none transition-all duration-1000 ease-out flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-xs text-white shadow-xl"
        style={{
          top: watermarkPos.top,
          left: watermarkPos.left,
          opacity: watermarkOpacity,
          transform: 'translate(-50%, -50%) scale(0.92)'
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[11px] font-bold tracking-wide">
          {studentName} &bull; {studentPhone}
        </span>
      </div>

      {/* -------------------------------------------------------------
          TOP BAR (Title & Security Status)
         ------------------------------------------------------------- */}
      <div
        className={`absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none flex items-center justify-between text-white ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-blue-600/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>محمي ومشفر</span>
          </span>
          <h2 className="text-sm font-bold text-white drop-shadow truncate max-w-md">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-[10px] font-mono font-bold text-slate-200">
            HD 1080p
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          CENTER PLAY / BUFFERING OVERLAY
         ------------------------------------------------------------- */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      )}

      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 hover:bg-blue-500 transition-all pointer-events-auto"
          >
            <Play className="w-7 h-7 translate-x-0.5 fill-white" />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          SECURITY TOAST NOTIFICATION
         ------------------------------------------------------------- */}
      {securityToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-rose-600/95 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-rose-400">
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          BOTTOM CONTROLS BAR (Custom Sleek Interface)
         ------------------------------------------------------------- */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PROGRESS SCRUBBER */}
        <div
          className="relative w-full h-2 group/bar cursor-pointer flex items-center mb-3"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            seek(pos * duration);
          }}
        >
          {/* Background track */}
          <div className="absolute inset-0 rounded-full bg-white/20 overflow-hidden">
            {/* Buffered bar */}
            <div
              className="h-full bg-white/30 transition-all duration-200"
              style={{ width: `${bufferPercent}%` }}
            />
          </div>

          {/* Played progress bar */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Scrubber Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg ring-2 ring-blue-500 transition-transform group-hover/bar:scale-125"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between text-white text-xs select-none">
          {/* Left Controls (Play, Skip, Volume, Time) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-white hover:text-blue-400 hover:bg-white/10 transition"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* Skip -10s */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-0.5"
              title="رجوع 10 ثواني"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] font-bold">10</span>
            </button>

            {/* Skip +10s */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-0.5"
              title="تقديم 10 ثواني"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[10px] font-bold">10</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Time Display */}
            <div className="font-mono text-[11px] text-slate-300 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls (Speed, Theater, Fullscreen) */}
          <div className="flex items-center gap-2">
            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs flex items-center gap-1 transition"
                title="سرعة التشغيل"
              >
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {isSpeedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col min-w-[90px] z-50">
                  <span className="px-3 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-800">
                    سرعة التشغيل
                  </span>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedSelect(spd)}
                      className={`px-3 py-1.5 text-right text-xs font-mono font-bold transition hover:bg-blue-600 hover:text-white ${
                        playbackSpeed === spd ? 'text-blue-400 bg-blue-500/10' : 'text-slate-200'
                      }`}
                    >
                      {spd === 1 ? '1x (عادي)' : `${spd}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theater Mode (if supplied) */}
            {onToggleTheater && (
              <button
                type="button"
                onClick={onToggleTheater}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                title={isTheater ? 'الوضع العادي' : 'وضع المسرح المكبر'}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title={isFullscreen ? 'تصغير الشاشة' : 'شاشة كاملة'}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
