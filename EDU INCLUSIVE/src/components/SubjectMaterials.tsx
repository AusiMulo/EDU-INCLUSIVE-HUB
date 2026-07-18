/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Video, HelpCircle, CheckCircle2, ChevronRight, RefreshCw, Cpu, Star, Layers, Compass } from 'lucide-react';
import { Lesson, Video as VideoType } from '../types';
import { EDUCATIVE_LESSONS, EDUCATIVE_VIDEOS } from '../data';

interface SubjectMaterialsProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
  onActivityLog: (activity: string, xpEarned: number) => void;
  onStartQuiz: (category: 'math' | 'science' | 'english' | 'it' | 'sign') => void;
}

const SUBJECT_DETAILS = {
  math: { label: 'Pre-Primary Math', color: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50' },
  science: { label: 'Primary Science', color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' },
  english: { label: 'English & Spelling', color: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', bg: 'bg-rose-50' },
  it: { label: 'IT & Technology Basics', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
  sign: { label: 'ASL Sign Language', color: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', bg: 'bg-indigo-50' }
};

export default function SubjectMaterials({
  completedLessons,
  onCompleteLesson,
  onActivityLog,
  onStartQuiz
}: SubjectMaterialsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'math' | 'science' | 'english' | 'it' | 'sign'>('math');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(EDUCATIVE_LESSONS[0]);
  const [selectedVideo, setSelectedVideo] = useState<VideoType>(EDUCATIVE_VIDEOS[0]);

  // Math Grid Interactive state
  const [mathX, setMathX] = useState<number | null>(null);
  const [mathY, setMathY] = useState<number | null>(null);

  // Solar planet inspector state
  const [selectedPlanet, setSelectedPlanet] = useState<string>('Earth');

  // English Sentence Builder state
  const [noun, setNoun] = useState('Dolphin 🐬');
  const [verb, setVerb] = useState('jumps 🦘');
  const [adjective, setAdjective] = useState('happy 🌟');

  // IT hardware inspector state
  const [hoveredHardwarePart, setHoveredHardwarePart] = useState<string | null>(null);

  const handleCategoryChange = (cat: 'math' | 'science' | 'english' | 'it' | 'sign') => {
    setSelectedCategory(cat);
    // Auto-select corresponding lesson and video
    const firstLesson = EDUCATIVE_LESSONS.find((l) => l.category === cat) || EDUCATIVE_LESSONS[0];
    const firstVideo = EDUCATIVE_VIDEOS.find((v) => v.subject === cat) || EDUCATIVE_VIDEOS[0];
    setSelectedLesson(firstLesson);
    setSelectedVideo(firstVideo);
    onActivityLog(`Opened subject directory: ${SUBJECT_DETAILS[cat].label}`, 2);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    onActivityLog(`Read lesson material: "${lesson.title}"`, 5);
  };

  const handleMarkCompleted = (id: string) => {
    onCompleteLesson(id);
    onActivityLog(`Completed educational lesson checklist: "${selectedLesson.title}"`, 15);
  };

  // Planets data
  const PLANETS_INFO: Record<string, { size: string; color: string; desc: string; temp: string; sign: string }> = {
    Mercury: { size: 'Smallest', color: 'bg-stone-400', desc: 'The closest planet to the Sun. It is super rocky and has no moons!', temp: 'Extremely hot days & cold nights', sign: 'ASL Sign: Tap hand twice on lips.' },
    Venus: { size: 'Earth-sized', color: 'bg-amber-300', desc: 'The hottest planet in our solar system because of its thick heavy clouds!', temp: '462 °C (Very hot!)', sign: 'ASL Sign: Draw a "V" shape in the air.' },
    Earth: { size: 'Medium', color: 'bg-blue-500 border-emerald-400', desc: 'Our home planet! Liquid oceans cover most of it, and it supports all of us.', temp: '15 °C average', sign: 'ASL Sign: Grab your left fist with your right thumb and index finger, twist side-to-side.' },
    Mars: { size: 'Small', color: 'bg-rose-500', desc: 'The "Red Planet". It is covered in iron dust, has giant volcanoes, and ice caps!', temp: '-60 °C', sign: 'ASL Sign: Point to cheek with an "M" shape.' },
    Jupiter: { size: 'Largest Planet', color: 'bg-amber-600 stripe', desc: 'A gas giant planet! It is 11 times wider than Earth and has a Great Red Spot storm!', temp: '-108 °C', sign: 'ASL Sign: Draw a big circle in the air.' },
    Saturn: { size: 'Huge with Rings', color: 'bg-yellow-200 border-amber-300', desc: 'Beautiful planet made of gas with thousands of rings made of ice, rocks, and dust!', temp: '-139 °C', sign: 'ASL Sign: Draw flat rings around your head.' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="section_subject_materials">
      {/* Subject Directories sidebar (3 cols) */}
      <div className="lg:col-span-3 flex flex-col gap-2.5">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
          Subject Directories
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {(Object.keys(SUBJECT_DETAILS) as Array<keyof typeof SUBJECT_DETAILS>).map((key) => {
            const detail = SUBJECT_DETAILS[key];
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                id={`btn_subject_${key}`}
                className={`flex items-center space-x-3 p-3 rounded-2xl text-left border transition-all ${
                  isActive
                    ? 'bg-white border-indigo-600 shadow-sm transform scale-102 font-bold text-indigo-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <div className={`h-8 w-8 rounded-xl ${detail.color} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                  {key === 'math' ? '🔢' : key === 'science' ? '🪐' : key === 'english' ? '🔤' : key === 'it' ? '🖥️' : '🤟'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none">{detail.label}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-1">Explore curriculum</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start corresponding quiz widget */}
        <div className="bg-indigo-950 text-white rounded-3xl p-5 mt-4 shadow-sm relative overflow-hidden border border-slate-200">
          <div className="absolute right-[-10px] bottom-[-15px] opacity-10 text-6xl">❓</div>
          <h4 className="font-display font-bold text-sm mb-1">Ready to Level Up?</h4>
          <p className="text-xs text-indigo-200 mb-3">Test your subject knowledge and earn interactive badges!</p>
          <button
            onClick={() => onStartQuiz(selectedCategory)}
            className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            🎯 Play {SUBJECT_DETAILS[selectedCategory].label} Quiz!
          </button>
        </div>
      </div>

      {/* Primary subject contents (9 cols) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* Main interactive Lesson and Chart Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold tracking-wider">
                  Active Lesson Guide
                </span>
                <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">
                  {selectedLesson.title}
                </h3>
              </div>
            </div>

            {/* Complete lesson button */}
            <button
              onClick={() => handleMarkCompleted(selectedLesson.id)}
              disabled={completedLessons.includes(selectedLesson.id)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                completedLessons.includes(selectedLesson.id)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{completedLessons.includes(selectedLesson.id) ? 'Lesson Completed!' : 'Mark Completed (+15 XP)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Written content */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedLesson.content}
              </p>

              {/* Inclusivity description helper */}
              {selectedLesson.signHelper && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <span>🤟</span>
                    <span>Sign Language Helper (Inclusivity)</span>
                  </span>
                  <p className="text-xs text-indigo-800 leading-relaxed italic font-medium">
                    {selectedLesson.signHelper}
                  </p>
                  {selectedLesson.signSteps && (
                    <ol className="list-decimal pl-4 text-[11px] text-slate-500 space-y-0.5 mt-1">
                      {selectedLesson.signSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Subject Charts & Visualizers (5 cols) */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-150 flex flex-col gap-3 min-h-[250px] justify-center">
              <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider text-center">
                Interactive Learning Chart
              </h4>

              {/* MATH: Multi-Grid Chart */}
              {selectedCategory === 'math' && (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-6 gap-1 max-w-[200px]">
                    {[1, 2, 3, 4, 5, 6].map((y) =>
                      [1, 2, 3, 4, 5, 6].map((x) => {
                        const isSelected = x === mathX && y === mathY;
                        const isRelated = x === mathX || y === mathY;
                        return (
                          <button
                            key={`${x}-${y}`}
                            onMouseEnter={() => { setMathX(x); setMathY(y); }}
                            onClick={() => { setMathX(x); setMathY(y); }}
                            className={`h-7 w-7 rounded-md text-[10px] font-mono font-bold transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-amber-950 scale-110 shadow-sm'
                                : isRelated
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-white text-stone-500 border border-stone-200'
                            }`}
                          >
                            {x * y}
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    {mathX && mathY ? (
                      <p className="text-xs font-display font-semibold text-stone-700">
                        {mathX} × {mathY} = <span className="text-amber-600 font-bold text-sm">{mathX * mathY}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-stone-400">Hover over the numbers grid to multiply!</p>
                    )}
                  </div>
                </div>
              )}

              {/* SCIENCE: Planets Inspector */}
              {selectedCategory === 'science' && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {Object.keys(PLANETS_INFO).map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedPlanet(name)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-lg border transition-all ${
                          selectedPlanet === name
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center flex flex-col items-center">
                    <div className={`h-12 w-12 rounded-full ${PLANETS_INFO[selectedPlanet].color} shadow-md mb-2 flex items-center justify-center text-white text-xs font-bold`}>
                      🪐
                    </div>
                    <p className="font-display font-bold text-xs text-stone-800">{selectedPlanet}</p>
                    <p className="text-[11px] text-stone-500 italic mt-0.5">{PLANETS_INFO[selectedPlanet].desc}</p>
                    <div className="flex justify-between w-full mt-2 border-t border-stone-100 pt-1.5 text-[10px] font-mono">
                      <span className="text-purple-600">{PLANETS_INFO[selectedPlanet].temp}</span>
                      <span className="text-stone-400">{PLANETS_INFO[selectedPlanet].size}</span>
                    </div>
                    <p className="text-[9px] text-indigo-600 font-bold mt-1.5">{PLANETS_INFO[selectedPlanet].sign}</p>
                  </div>
                </div>
              )}

              {/* ENGLISH: Sentence builder */}
              {selectedCategory === 'english' && (
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] text-stone-500 leading-tight text-center">
                    Click items to construct a grammar sentence!
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Nouns */}
                    <div className="flex flex-col gap-1 border-r border-stone-200 pr-1">
                      <span className="text-[9px] font-mono font-bold text-rose-500 text-center">Nouns (Subject)</span>
                      {['Cat 🐱', 'IT Bot 💻', 'Butterfly 🦋', 'Dolphin 🐬'].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNoun(n)}
                          className={`text-[10px] py-1 rounded-md text-center font-medium ${
                            noun === n ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-white text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {n.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                    {/* Verbs */}
                    <div className="flex flex-col gap-1 border-r border-stone-200 px-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-500 text-center">Verbs (Action)</span>
                      {['jumps 🦘', 'types ⌨️', 'signs 🤟', 'flies 🦅'].map((v) => (
                        <button
                          key={v}
                          onClick={() => setVerb(v)}
                          className={`text-[10px] py-1 rounded-md text-center font-medium ${
                            verb === v ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-white text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {v.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                    {/* Adjectives */}
                    <div className="flex flex-col gap-1 pl-1">
                      <span className="text-[9px] font-mono font-bold text-amber-500 text-center">Adjectives</span>
                      {['happy 🌟', 'clever 🧠', 'speedy ⚡', 'friendly 🌸'].map((adj) => (
                        <button
                          key={adj}
                          onClick={() => setAdjective(adj)}
                          className={`text-[10px] py-1 rounded-md text-center font-medium ${
                            adjective === adj ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-white text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {adj.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-150 text-center mt-2 shadow-xs">
                    <p className="text-xs font-display text-stone-500 font-semibold">Your Constructed Sentence:</p>
                    <p className="text-sm font-display font-bold text-stone-800 mt-1 leading-snug">
                      "The <span className="text-amber-600">{adjective.split(' ')[0]}</span> {noun.split(' ')[0]} <span className="text-emerald-600">{verb}</span>!"
                    </p>
                  </div>
                </div>
              )}

              {/* IT: Computer Hardware Blueprint */}
              {selectedCategory === 'it' && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-stone-500 text-center mb-1">Hover over components to inspect hardware</p>
                  
                  <div className="relative border-2 border-dashed border-blue-200 rounded-xl p-3 bg-white flex flex-col gap-2">
                    <div className="flex items-center justify-around">
                      <button
                        onMouseEnter={() => setHoveredHardwarePart('cpu')}
                        onMouseLeave={() => setHoveredHardwarePart(null)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center space-x-1 border border-blue-200"
                      >
                        <Cpu className="h-4 w-4" />
                        <span className="text-[10px] font-bold">CPU Brain</span>
                      </button>

                      <button
                        onMouseEnter={() => setHoveredHardwarePart('screen')}
                        onMouseLeave={() => setHoveredHardwarePart(null)}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center space-x-1 border border-indigo-200"
                      >
                        <span>🖥️</span>
                        <span className="text-[10px] font-bold">Screen</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-around">
                      <button
                        onMouseEnter={() => setHoveredHardwarePart('keyboard')}
                        onMouseLeave={() => setHoveredHardwarePart(null)}
                        className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg flex items-center space-x-1 border border-purple-200"
                      >
                        <span>⌨️</span>
                        <span className="text-[10px] font-bold">Keyboard</span>
                      </button>

                      <button
                        onMouseEnter={() => setHoveredHardwarePart('mouse')}
                        onMouseLeave={() => setHoveredHardwarePart(null)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg flex items-center space-x-1 border border-emerald-200"
                      >
                        <span>🖱️</span>
                        <span className="text-[10px] font-bold">Mouse</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-150 min-h-[60px] text-center flex items-center justify-center">
                    {hoveredHardwarePart === 'cpu' && (
                      <p className="text-[10px] text-blue-900 leading-normal">
                        <strong>CPU (Central Processor)</strong>: The computer's brain. It thinks extremely fast and does calculations!
                      </p>
                    )}
                    {hoveredHardwarePart === 'screen' && (
                      <p className="text-[10px] text-indigo-900 leading-normal">
                        <strong>Monitor / Screen</strong>: The visual display that shows colorful images, lessons, and numbers.
                      </p>
                    )}
                    {hoveredHardwarePart === 'keyboard' && (
                      <p className="text-[10px] text-purple-900 leading-normal">
                        <strong>Keyboard Keys</strong>: Used to type instructions and spell words directly into programs.
                      </p>
                    )}
                    {hoveredHardwarePart === 'mouse' && (
                      <p className="text-[10px] text-emerald-900 leading-normal">
                        <strong>Mouse clicker</strong>: Points at folders and buttons with simple click gestures!
                      </p>
                    )}
                    {!hoveredHardwarePart && (
                      <p className="text-[10px] text-stone-400 italic">Hover over any computer part above to inspect it!</p>
                    )}
                  </div>
                </div>
              )}

              {/* SIGN: ASL interactive vowels helper */}
              {selectedCategory === 'sign' && (
                <div className="flex flex-col gap-2 text-center">
                  <p className="text-[11px] text-stone-500 leading-tight">🤟 Form these ASL vowels on your hands!</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { l: 'A', e: '✊', desc: 'Fist, thumb on side' },
                      { l: 'B', e: '✋', desc: 'Open flat hand' },
                      { l: 'C', e: '👌', desc: 'Curved circle' },
                      { l: 'I', e: '🤙', desc: 'Pinky finger straight up' }
                    ].map((v) => (
                      <div key={v.l} className="bg-white p-2 rounded-xl border border-stone-250 flex flex-col items-center shadow-xs">
                        <span className="text-sm font-bold text-indigo-700">{v.l}</span>
                        <span className="text-xl my-0.5">{v.e}</span>
                        <span className="text-[8px] text-stone-400 leading-none">{v.desc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-indigo-600 font-bold mt-1 animate-pulse">Go to "Sign Language Section" tab to type and translate any word!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Lectures Module */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 mb-4">
            <span className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
              <Video className="h-4 w-4" />
            </span>
            <h4 className="font-display font-bold text-sm text-stone-900">
              Simulated Cartoon Video Lectures
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Custom Interactive Player */}
            <div className="md:col-span-8 flex flex-col">
              <div className="aspect-video w-full bg-stone-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-stone-800 shadow-lg">
                {/* Simulated Youtube Embed Player (or iframe) */}
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-stone-900">{selectedVideo.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{selectedVideo.description}</p>
                </div>
                <span className="text-[10px] font-mono bg-stone-100 px-2 py-1 rounded-md text-stone-600">
                  Duration: {selectedVideo.duration}
                </span>
              </div>
            </div>

            {/* Curated videos playlist */}
            <div className="md:col-span-4 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                Playlist Lessons
              </span>
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px]">
                {EDUCATIVE_VIDEOS.map((vid) => {
                  const isCurrent = selectedVideo.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => { setSelectedVideo(vid); onActivityLog(`Switched lesson video to: "${vid.title}"`, 2); }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2.5 ${
                        isCurrent
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-xl">{vid.thumbnail}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display leading-tight">{vid.title}</p>
                        <p className="text-[9px] text-stone-400 capitalize">{vid.subject} lecture</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
