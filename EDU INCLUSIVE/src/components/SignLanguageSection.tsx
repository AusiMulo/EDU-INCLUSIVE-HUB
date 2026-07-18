/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, Keyboard, HelpCircle, ArrowRight, Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ASL_ALPHABET, ASLSign } from '../data';

interface SignLanguageSectionProps {
  onActivityLog: (activity: string, xpEarned: number) => void;
}

const IT_HEARING_LESSONS = [
  {
    title: 'The Screen (Your Window) 🖥️',
    description: 'The screen displays your homework, colors, and math drawings. In sign language, we create a giant visual window.',
    signGuide: 'Draw a rectangle in front of your face with both index fingers, then point to it with a smile!',
    steps: ['Extend both index fingers side by side.', 'Draw a box shape in the air.', 'Point inside the box.'],
    practiceText: 'Click the Screen button below twice to trigger a flash of colors!'
  },
  {
    title: 'The Keyboard Keys ⌨️',
    description: 'We use the keyboard to type words and instruct computers. Its sign represents our fingers tapping keys.',
    signGuide: 'Hold your non-dominant hand flat, and flutter all dominant fingers horizontally over it as if typing quickly!',
    steps: ['Place left hand horizontal in front of chest.', 'Flutter right fingers on top of left hand.', 'Smile and bleep like a computer!'],
    practiceText: 'Type your name in the fingerspelling box above to watch it translate!'
  },
  {
    title: 'The Mouse Clicker 🖱️',
    description: 'The mouse moves an arrow to press buttons. Its sign mimics clicking our finger.',
    signGuide: 'Hold your dominant hand forward, curl your ring and pinky fingers, and tap your index finger down twice!',
    steps: ['Curl pinky and ring finger.', 'Keep index and middle fingers extended forward.', 'Tap index finger twice, making a clicking sound.'],
    practiceText: 'Click the practice button below to score high-speed reaction clicks!'
  }
];

export default function SignLanguageSection({ onActivityLog }: SignLanguageSectionProps) {
  const [activeSign, setActiveSign] = useState<ASLSign>(ASL_ALPHABET.A);
  const [translateWord, setTranslateWord] = useState('CAT');
  const [itLessonIdx, setItLessonIdx] = useState(0);

  // Reaction Click practice game state
  const [clickCount, setClickCount] = useState(0);
  const [flashColor, setFlashColor] = useState('bg-slate-800');

  const triggerColorFlash = () => {
    const colors = ['bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500', 'bg-indigo-500'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    setFlashColor(randColor);
    setClickCount((prev) => prev + 1);
    if (clickCount >= 5) {
      onActivityLog('Completed visual reaction keyboard-clicking task', 12);
    }
  };

  const handleWordTranslate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow standard letters
    const filtered = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setTranslateWord(filtered.slice(0, 10)); // Limit to 10 letters
    if (filtered.length > 0) {
      onActivityLog(`Translated word "${filtered}" into ASL fingerspelling`, 5);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="section_sign_language">
      {/* Dictionary and live fingerspeller (7 cols) */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        
        {/* Fingerspelling Translator Widget */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-150">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Eye className="h-4.5 w-4.5" />
            </span>
            <h4 className="font-display font-bold text-sm text-slate-800">
              Interactive Fingerspelling Translator
            </h4>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Type any word (A to Z) to watch it translate to Sign Language cards:
            </label>
            <input
              type="text"
              value={translateWord}
              onChange={handleWordTranslate}
              placeholder="TYPE HERE (E.G., HELLO)"
              className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-2.5 font-mono font-bold text-indigo-900 tracking-wide focus:outline-hidden focus:ring-2 focus:ring-indigo-500 uppercase text-sm"
            />
          </div>

          {/* Cards output */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 min-h-[140px] flex items-center justify-center flex-wrap gap-2">
            {translateWord.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Type a word above to see sign cards!</p>
            ) : (
              translateWord.split('').map((char, idx) => {
                const sign = ASL_ALPHABET[char];
                return (
                  <div
                    key={idx}
                    className="bg-white px-2 py-3 rounded-xl border border-indigo-200 flex flex-col items-center justify-center shadow-xs w-14 shrink-0 transform hover:scale-105 transition-transform"
                  >
                    <span className="text-xs font-mono font-bold text-slate-400 mb-1">{char}</span>
                    <span className="text-2xl mb-1">{sign ? sign.emoji : '✊'}</span>
                    <span className="text-[7px] text-slate-500 text-center uppercase tracking-tighter">
                      {sign ? sign.letter : char}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ASL Interactive Alphabet panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-150 mb-4">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </span>
            <h4 className="font-display font-bold text-sm text-slate-800">
              Interactive ASL Vowels & Letters Inspector
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Interactive Letters buttons */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Select Sign Letter:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {Object.keys(ASL_ALPHABET).map((l) => {
                  const isActive = activeSign.letter === l;
                  return (
                    <button
                      key={l}
                      onClick={() => { setActiveSign(ASL_ALPHABET[l]); onActivityLog(`Inspected ASL sign letter: "${l}"`, 2); }}
                      className={`h-11 rounded-xl font-bold font-display transition-all border text-sm flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{l}</span>
                      <span className="text-[10px] font-normal leading-none -mt-0.5">{ASL_ALPHABET[l].emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Letter details display card */}
            <div className="md:col-span-7 bg-indigo-50 border border-indigo-150 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-3xl">{activeSign.emoji}</span>
                    <span className="font-display font-bold text-lg text-indigo-900">ASL Letter "{activeSign.letter}"</span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    Learn & Practice
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-indigo-950">
                  <p><strong>Handshape:</strong> {activeSign.handshape}</p>
                  <p><strong>Palm orientation:</strong> {activeSign.orientation}</p>
                  <p><strong>Hand movement:</strong> {activeSign.movement}</p>
                </div>
              </div>

              {/* ASCII Visual guide */}
              <div className="mt-4 bg-indigo-950 rounded-xl p-3 border border-indigo-800 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-indigo-400 block uppercase mb-1">
                    ASCII Hand shape model:
                  </span>
                  <pre className="font-mono text-[9px] text-emerald-400 leading-tight select-none">
                    {activeSign.visualPattern}
                  </pre>
                </div>

                {/* Fun click guide */}
                <div className="text-right flex flex-col gap-1 max-w-[120px]">
                  <span className="text-[9px] text-indigo-300 italic">Try mirroring this shape on your hand!</span>
                  <button
                    onClick={() => onActivityLog(`Mirrored ASL Sign letter "${activeSign.letter}"`, 5)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer"
                  >
                    👍 Practiced sign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* IT subject for hearing impaired (5 cols) */}
      <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-150 mb-4">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Keyboard className="h-4.5 w-4.5 animate-pulse" />
            </span>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-800 leading-none">
                Inclusive IT For Students
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Simplified IT concepts for hearing-impaired pupils</span>
            </div>
          </div>

          {/* Active lesson */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Lesson {itLessonIdx + 1} of {IT_HEARING_LESSONS.length}
              </span>
              <span className="text-xl">💻</span>
            </div>

            <h4 className="font-display font-bold text-blue-900 text-sm">
              {IT_HEARING_LESSONS[itLessonIdx].title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {IT_HEARING_LESSONS[itLessonIdx].description}
            </p>

            <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs">
              <p className="font-bold text-blue-950 flex items-center space-x-1.5">
                <span>🤟</span>
                <span>ASL Visual Helper:</span>
              </p>
              <p className="text-slate-700 mt-1 italic">"{IT_HEARING_LESSONS[itLessonIdx].signGuide}"</p>
              <div className="mt-2 text-[10px] font-mono text-slate-400 space-y-0.5 pl-2 border-l-2 border-blue-200">
                {IT_HEARING_LESSONS[itLessonIdx].steps.map((st, i) => (
                  <p key={i}>{i+1}. {st}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => setItLessonIdx((prev) => (prev > 0 ? prev - 1 : IT_HEARING_LESSONS.length - 1))}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={() => {
                setItLessonIdx((prev) => (prev + 1) % IT_HEARING_LESSONS.length);
                onActivityLog(`Read hearing-impaired IT lesson: "${IT_HEARING_LESSONS[itLessonIdx].title}"`, 5);
              }}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Mouse and Key tap Practice Mini-game */}
        <div className="border-t border-slate-150 pt-4 mt-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Interaction: Click & Speed Practice Game
          </span>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 flex items-center justify-between">
            {/* Click target flash */}
            <button
              onClick={triggerColorFlash}
              className={`h-12 w-24 rounded-xl text-white font-bold text-xs flex items-center justify-center transition-all transform active:scale-95 shadow-xs cursor-pointer ${flashColor}`}
            >
              CLICK ME!
            </button>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Score: {clickCount} Clicks</p>
              <p className="text-[10px] text-slate-500 mt-0.5 italic">Practice fast cursor actions!</p>
              {clickCount >= 5 && (
                <span className="inline-block mt-1 text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  ⚡ IT Expert! (+12 XP)
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
