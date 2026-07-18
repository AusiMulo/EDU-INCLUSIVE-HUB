/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Award, ArrowRight, RefreshCw, Star } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';
import { SUBJECT_QUIZZES } from '../data';

interface QuizzesProps {
  activeQuizId: string | null;
  onCloseQuiz: () => void;
  onQuizSubmit: (quizId: string, scorePercentage: number, xpEarned: number) => void;
  onActivityLog: (activity: string, xpEarned: number) => void;
}

export default function Quizzes({
  activeQuizId,
  onCloseQuiz,
  onQuizSubmit,
  onActivityLog
}: QuizzesProps) {
  // Find selected quiz or default to first
  const activeQuiz = SUBJECT_QUIZZES.find((q) => q.id === activeQuizId) || SUBJECT_QUIZZES[0];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = activeQuiz.questions[currentQuestionIdx];

  // Synthesize client-side sounds to elevate student engagement
  const playQuizSound = (type: 'correct' | 'incorrect' | 'victory') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (type === 'correct') {
        // High ascending double chime (C5 -> E5)
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start();
        osc2.start(audioCtx.currentTime + 0.08);

        osc1.stop(audioCtx.currentTime + 0.35);
        osc2.stop(audioCtx.currentTime + 0.35);

      } else if (type === 'incorrect') {
        // Flat buzz tone (G2 sawtooth)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110.00, audioCtx.currentTime); // A2

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);

      } else if (type === 'victory') {
        // Chord fanfare (C4 -> E4 -> G4 -> C5)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);

          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + 0.6);
        });
      }
    } catch (err) {
      console.warn('Web Audio synthesis not supported in this client:', err);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsSubmitted(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playQuizSound('correct');
      onActivityLog(`Answered correctly: "${currentQuestion.question}"`, 5);
    } else {
      playQuizSound('incorrect');
      onActivityLog(`Incorrect quiz attempt on: "${currentQuestion.question}"`, 0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finished!
      const scorePercentage = Math.round((score / activeQuiz.questions.length) * 100);
      const xpEarned = Math.round((score / activeQuiz.questions.length) * activeQuiz.points);
      
      setQuizFinished(true);
      playQuizSound('victory');
      onQuizSubmit(activeQuiz.id, scorePercentage, xpEarned);
      onActivityLog(`Finished quiz "${activeQuiz.title}" with score ${scorePercentage}%`, xpEarned);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const finalPercent = Math.round((score / activeQuiz.questions.length) * 100);
    const xpPointsEarned = Math.round((score / activeQuiz.questions.length) * activeQuiz.points);

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-sm" id="section_quiz_results">
        <div className="mx-auto h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-float-slow">
          <Award className="h-10 w-10 fill-amber-100" />
        </div>

        <span className="text-xs font-mono font-bold uppercase text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
          Quiz Completed!
        </span>

        <h3 className="font-display font-bold text-2xl text-slate-800 mt-4 leading-tight">
          Excellent Job, Learning Star! ⭐
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          You finished the quiz for <strong>{activeQuiz.title}</strong>!
        </p>

        {/* Score Ring */}
        <div className="my-6 inline-block bg-slate-50 border border-indigo-200 rounded-full p-6 shadow-inner">
          <div className="text-3xl font-display font-black text-indigo-700">{score} / {activeQuiz.questions.length}</div>
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mt-0.5">Correct Answers</div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center space-x-1.5 w-full sm:w-auto justify-center">
            <span className="text-xl">🌟</span>
            <span className="text-xs font-bold text-emerald-800">Earned +{xpPointsEarned} XP Points</span>
          </div>

          {finalPercent === 100 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 flex items-center space-x-1.5 w-full sm:w-auto justify-center">
              <span className="text-xl">🏆</span>
              <span className="text-xs font-bold text-amber-800">Unlock Math Wizard Badge!</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-8 pt-4 border-t border-slate-150">
          <button
            onClick={handleRestartQuiz}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all text-xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onCloseQuiz}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-all text-xs flex items-center justify-center shadow-xs cursor-pointer"
          >
            <span>Close Playgrounds</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl mx-auto shadow-sm" id="section_quiz_playground">
      {/* Quiz Header */}
      <div className="flex justify-between items-center border-b border-slate-150 pb-3.5 mb-5">
        <div>
          <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold tracking-wider">
            Educational Quiz Active
          </span>
          <h4 className="font-display font-bold text-slate-800 text-sm">{activeQuiz.title}</h4>
        </div>
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Q: {currentQuestionIdx + 1} / {activeQuiz.questions.length}
        </span>
      </div>

      {/* Progress timeline */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          style={{ width: `${((currentQuestionIdx) / activeQuiz.questions.length) * 100}%` }}
          className="bg-indigo-500 h-full transition-all duration-300"
        />
      </div>

      {/* Question prompt */}
      <div className="mb-6">
        <p className="font-display font-bold text-base text-slate-800 leading-snug">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options Stack */}
      <div className="flex flex-col gap-2.5">
        {currentQuestion.options.map((opt, idx) => {
          let optionStyles = 'border-slate-200 hover:bg-slate-50 text-slate-700';
          let indicatorIcon = null;

          if (selectedOption === idx) {
            optionStyles = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold';
          }

          if (isSubmitted) {
            if (idx === currentQuestion.correctAnswer) {
              optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
              indicatorIcon = <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />;
            } else if (selectedOption === idx) {
              optionStyles = 'bg-red-50 border-red-500 text-red-900';
              indicatorIcon = <XCircle className="h-4.5 w-4.5 text-red-500" />;
            } else {
              optionStyles = 'border-slate-100 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs font-medium cursor-pointer ${optionStyles}`}
              disabled={isSubmitted}
            >
              <span>{opt}</span>
              {indicatorIcon}
            </button>
          );
        })}
      </div>

      {/* Explanations card */}
      {isSubmitted && (
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs animate-float">
          <p className="font-bold text-slate-800 mb-1">📘 Fun Fact / Lesson explanation:</p>
          <p className="text-slate-600 leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Control Actions footer */}
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-150">
        <button
          onClick={onCloseQuiz}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Quit Play
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleAnswerSubmit}
            disabled={selectedOption === null}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1 shadow-xs cursor-pointer"
          >
            <span>{currentQuestionIdx + 1 === activeQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

    </div>
  );
}
