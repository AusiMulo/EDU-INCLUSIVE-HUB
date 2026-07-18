/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Sparkles } from 'lucide-react';
import { Song } from '../types';
import { EDUCATIVE_SONGS } from '../data';

interface MusicPlayerProps {
  onActivityLog: (activity: string, xpEarned: number) => void;
}

export default function MusicPlayer({ onActivityLog }: MusicPlayerProps) {
  const [selectedSong, setSelectedSong] = useState<Song>(EDUCATIVE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a synthesized retro bleep-bloop tone
  const playChiptuneTone = (frequency: number, durationSec: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // triangle wave sounds cute, soft, and retro
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch (err) {
      console.warn('AudioContext failed to initialize:', err);
    }
  };

  // Playback timer & sound sequence coordinator
  useEffect(() => {
    if (isPlaying) {
      // Audio note generator interval (every 600ms)
      const noteInterval = setInterval(() => {
        const notes = selectedSong.notes;
        const currentNoteFreq = notes[noteIndex % notes.length];
        playChiptuneTone(currentNoteFreq, 0.4);
        setNoteIndex((prev) => prev + 1);
      }, 60000 / selectedSong.tempo);

      // Lyrics timeline interval (1s)
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 1;
          // Loop song if it exceeds duration
          if (nextTime > 26) {
            onActivityLog(`Listened to educational song: "${selectedSong.title}"`, 10);
            return 0;
          }
          return nextTime;
        });
      }, 1000);

      return () => {
        clearInterval(noteInterval);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isPlaying, noteIndex, selectedSong]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      onActivityLog(`Started playing tutoring song: "${selectedSong.title}"`, 5);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setNoteIndex(0);
  };

  const handleSongSelect = (song: Song) => {
    setIsPlaying(false);
    setSelectedSong(song);
    setCurrentTime(0);
    setNoteIndex(0);
    onActivityLog(`Selected tutoring song: "${song.title}"`, 2);
  };

  // Find corresponding lyric line to highlight
  const getActiveLyric = () => {
    const sortedLyrics = [...selectedSong.lyrics].sort((a, b) => b.time - a.time);
    const found = sortedLyrics.find((lyric) => currentTime >= lyric.time);
    return found ? found.text : '🎵 Hand Signing Karaoke! 🤟';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6" id="section_tutoring_songs">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left playlist selectors */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-150">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Music className="h-4.5 w-4.5 animate-bounce" />
            </span>
            <h4 className="font-display font-bold text-sm text-slate-800">
              Interactive Tutoring Songs
            </h4>
          </div>

          <div className="flex flex-col gap-2">
            {EDUCATIVE_SONGS.map((song) => {
              const isSelected = selectedSong.id === song.id;
              return (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="text-2xl">{song.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-slate-800">{song.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate leading-tight">{song.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sound warning box */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10px] text-amber-800 leading-normal flex items-start space-x-1.5 mt-2">
            <Volume2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>Chiptune sound active!</strong> Press play to hear an educational bleep-bloop melody synthesized right in your browser!
            </span>
          </div>
        </div>

        {/* Right Song Active Screen */}
        <div className="lg:w-2/3 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between items-center relative overflow-hidden min-h-[300px]">
          {/* Subtle sparkles animation in background */}
          <div className="absolute top-2 right-2 text-indigo-200">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>

          {/* Equalizer animation */}
          <div className="flex items-end justify-center space-x-1.5 h-12 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
              // Generate pseudo random heights when playing
              const duration = 0.5 + bar * 0.15;
              return (
                <div
                  key={bar}
                  style={{
                    animationDuration: isPlaying ? `${duration}s` : '0s',
                    height: isPlaying ? '100%' : '15%'
                  }}
                  className="w-2 bg-indigo-500 rounded-full transition-all duration-300 transform origin-bottom animate-bounce"
                />
              );
            })}
          </div>

          {/* Lyrics Monitor screen */}
          <div className="flex-1 w-full bg-indigo-950 rounded-2xl border-4 border-indigo-900 p-5 flex flex-col items-center justify-center text-center shadow-inner relative">
            <span className="absolute top-2 left-3 text-[9px] font-mono tracking-wider text-indigo-400 uppercase">
              Karaoke Prompter Mode
            </span>
            <p className="text-xl font-display font-bold text-white leading-relaxed select-none animate-float px-4">
              {getActiveLyric()}
            </p>
          </div>

          {/* Karaoke Progress Timeline */}
          <div className="w-full mt-4 bg-slate-200 h-2 rounded-full overflow-hidden relative">
            <div
              style={{ width: `${(currentTime / 26) * 100}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            />
          </div>

          {/* Player controls */}
          <div className="flex items-center space-x-4 mt-4 z-10">
            <button
              onClick={handleReset}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-100 transition-all hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
              title="Restart song"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handlePlayPause}
              id="btn_play_song"
              className={`p-4 rounded-full text-white transition-all transform hover:scale-110 active:scale-95 shadow-xs cursor-pointer ${
                isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isPlaying ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white" />}
            </button>

            <span className="font-mono text-xs text-slate-500 font-bold">
              {String(Math.floor(currentTime / 60)).padStart(2, '0')}:
              {String(currentTime % 60).padStart(2, '0')} / 00:26
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
