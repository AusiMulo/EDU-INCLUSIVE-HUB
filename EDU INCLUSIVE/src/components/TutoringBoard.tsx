/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Edit3, Square, Circle, Stars, Image, Download, Grid, Sparkles } from 'lucide-react';
import { BoardSticker } from '../types';

interface TutoringBoardProps {
  onActivityLog: (activity: string, xpEarned: number) => void;
}

const COLORS = [
  { name: 'Chalk White/Black', value: '#ffffff', bg: 'bg-white border-stone-300' },
  { name: 'Marker Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Marker Green', value: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Chalk Pink/Red', value: '#f43f5e', bg: 'bg-rose-500' },
  { name: 'Chalk Yellow', value: '#f59e0b', bg: 'bg-amber-400' },
  { name: 'Marker Purple', value: '#8b5cf6', bg: 'bg-violet-500' }
];

const STICKERS = ['⭐', '🎈', '💻', '🤟', '🐱', '🍎', '🌈', '🪐', '💡'];

const TEMPLATES = [
  { id: 'blank', name: 'Blank Board', description: 'Draw anything you like!' },
  { id: 'math', name: 'Math Grid Trace', description: 'Practice squares, triangles, and addition!' },
  { id: 'asl_a', name: 'ASL Letter "A" Trace', description: 'Trace and practice fingerspelling letter A' },
  { id: 'spelling', name: 'Spelling practice: C-A-T', description: 'Connect the dots to spell CAT!' }
];

export default function TutoringBoard({ onActivityLog }: TutoringBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boardType, setBoardType] = useState<'blackboard' | 'whiteboard'>('blackboard');
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('blank');
  const [stickers, setStickers] = useState<BoardSticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<'draw' | 'stamp' | 'erase'>('draw');

  // Track canvas sizing on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Keep drawing copy
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

        canvas.width = width;
        canvas.height = height || 400;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.drawImage(tempCanvas, 0, 0);
          drawTemplateBackground(canvas, ctx, activeTemplate, boardType);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTemplate, boardType]);

  // Redraw when template or boardType changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset board color palette default if switching blackboard vs whiteboard
    if (boardType === 'blackboard' && color === '#000000') {
      setColor('#ffffff');
    } else if (boardType === 'whiteboard' && color === '#ffffff') {
      setColor('#1e293b');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTemplateBackground(canvas, ctx, activeTemplate, boardType);
  }, [activeTemplate, boardType]);

  const drawTemplateBackground = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    templateId: string,
    type: 'blackboard' | 'whiteboard'
  ) => {
    const lightMode = type === 'whiteboard';
    const gridColor = lightMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(255, 255, 255, 0.1)';
    const strokeColor = lightMode ? '#475569' : '#e2e8f0';

    ctx.save();

    if (templateId === 'math') {
      // Draw Grid System
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw dashed shapes to trace
      ctx.strokeStyle = strokeColor;
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;

      // Triangle
      ctx.beginPath();
      ctx.moveTo(100, 150);
      ctx.lineTo(200, 150);
      ctx.lineTo(150, 50);
      ctx.closePath();
      ctx.stroke();

      // Square
      ctx.strokeRect(300, 50, 100, 100);

      // Label text
      ctx.fillStyle = lightMode ? '#0f172a' : '#f8fafc';
      ctx.font = '14px font-display, sans-serif';
      ctx.fillText('Trace the Triangle & Square!', 120, 200);

    } else if (templateId === 'asl_a') {
      // Trace Letter A and ASL pattern
      ctx.fillStyle = lightMode ? '#0f172a' : '#f8fafc';
      ctx.font = '24px font-display, sans-serif';
      ctx.fillText('ASL Finger Spelling - Letter "A"', 40, 50);

      // Large outline letter A to trace
      ctx.strokeStyle = gridColor;
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(150, 280);
      ctx.lineTo(210, 100);
      ctx.lineTo(270, 280);
      ctx.moveTo(180, 200);
      ctx.lineTo(240, 200);
      ctx.stroke();

      // Help instructions
      ctx.font = '14px font-sans, sans-serif';
      ctx.fillStyle = lightMode ? '#64748b' : '#94a3b8';
      ctx.fillText('1. Trace the big A', 320, 120);
      ctx.fillText('2. Curl fingers tight to make a fist!', 320, 150);
      ctx.fillText('3. Rest thumb on side to sign ASL "A"', 320, 180);

    } else if (templateId === 'spelling') {
      // Spelling tracer: C - A - T
      ctx.fillStyle = lightMode ? '#4338ca' : '#a5b4fc';
      ctx.font = '24px font-display, sans-serif';
      ctx.fillText('Dot-to-Dot spelling practice', 40, 60);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // Dots for C
      drawDot(ctx, 100, 150, '1 (C)', lightMode);
      drawDot(ctx, 60, 180, '2', lightMode);
      drawDot(ctx, 100, 210, '3', lightMode);

      // Dots for A
      drawDot(ctx, 180, 210, '4 (A)', lightMode);
      drawDot(ctx, 210, 150, '5', lightMode);
      drawDot(ctx, 240, 210, '6', lightMode);

      // Dots for T
      drawDot(ctx, 300, 150, '7 (T)', lightMode);
      drawDot(ctx, 360, 150, '8', lightMode);
      drawDot(ctx, 330, 210, '9', lightMode);
    }

    ctx.restore();
  };

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, lightMode: boolean) => {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillStyle = lightMode ? '#0f172a' : '#ffffff';
    ctx.font = '12px font-mono, monospace';
    ctx.fillText(label, x - 10, y - 12);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    if (!coords) return;

    if (toolMode === 'stamp') {
      if (selectedSticker) {
        const newSticker: BoardSticker = {
          id: `sticker_${Date.now()}`,
          type: 'emoji',
          value: selectedSticker,
          x: coords.x,
          y: coords.y,
          size: brushSize * 4 + 20
        };
        setStickers((prev) => [...prev, newSticker]);
        onActivityLog(`Stamped sticker "${selectedSticker}" on board`, 2);
      }
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = toolMode === 'erase' ? (boardType === 'blackboard' ? '#064e3b' : '#ffffff') : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    if (!coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = toolMode === 'erase' ? (boardType === 'blackboard' ? '#14532d' : '#ffffff') : color;
    ctx.lineWidth = toolMode === 'erase' ? brushSize * 3 : brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onActivityLog('Drew sketch on Interactive Tutoring Board', 5);
    }
  };

  const getEventCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTemplateBackground(canvas, ctx, activeTemplate, boardType);
    setStickers([]);
    onActivityLog('Cleared the Tutoring Board', 0);
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const saveBoardImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Combine drawing with background & stickers
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    // Background color
    exportCtx.fillStyle = boardType === 'blackboard' ? '#0f3e2e' : '#ffffff';
    exportCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw templates
    drawTemplateBackground(exportCanvas, exportCtx, activeTemplate, boardType);

    // Draw stickers
    stickers.forEach((s) => {
      exportCtx.font = `${s.size}px Arial`;
      exportCtx.textAlign = 'center';
      exportCtx.textBaseline = 'middle';
      exportCtx.fillText(s.value, s.x, s.y);
    });

    // Draw main drawing canvas
    exportCtx.drawImage(canvas, 0, 0);

    const image = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `edu_board_${activeTemplate}.png`;
    link.href = image;
    link.click();
    onActivityLog('Saved board artwork to file', 10);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm" id="section_tutoring_board">
      {/* Header Controls */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </span>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800 leading-none">
              Interactive Tutoring Board
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Physical & Blended drawing playground for students and educators
            </span>
          </div>
        </div>

        {/* Board toggles */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-250">
            <button
              onClick={() => { setBoardType('blackboard'); setStickers([]); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                boardType === 'blackboard' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              🟢 Classroom Blackboard
            </button>
            <button
              onClick={() => { setBoardType('whiteboard'); setStickers([]); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                boardType === 'whiteboard' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚪ Whiteboard Marker
            </button>
          </div>

          <button
            onClick={saveBoardImage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
            title="Download board as image"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Save Art</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4">
        {/* Left Control Rail */}
        <div className="xl:col-span-1 bg-slate-50/50 p-4 border-r border-slate-200 flex flex-col gap-4">
          {/* Templates */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wider mb-2">
              1. Choose Tracing Template
            </h4>
            <div className="flex flex-col gap-1.5">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    activeTemplate === tmpl.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-display font-semibold">{tmpl.name}</p>
                  <p className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">{tmpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Draw Tools */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-455 uppercase tracking-wider mb-2">
              2. Sketchpad Tools
            </h4>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <button
                onClick={() => setToolMode('draw')}
                className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                  toolMode === 'draw'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                <span>Chalk</span>
              </button>

              <button
                onClick={() => setToolMode('erase')}
                className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                  toolMode === 'erase'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                <span>Erase</span>
              </button>

              <button
                onClick={() => {
                  setToolMode('stamp');
                  if (!selectedSticker) setSelectedSticker(STICKERS[0]);
                }}
                className={`py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                  toolMode === 'stamp'
                    ? 'bg-emerald-650 text-white border-emerald-650'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Stars className="h-4 w-4" />
                <span>Stamp</span>
              </button>
            </div>

            {/* Brush Size */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Stroke Size:</span>
                <span className="font-mono font-bold text-slate-700">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Color Palettes (Only if draw mode) */}
          {toolMode === 'draw' && (
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-455 uppercase tracking-wider mb-2">
                3. Color Palettes
              </h4>
              <div className="grid grid-cols-6 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                {COLORS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setColor(col.value)}
                    className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${col.bg} ${
                      color === col.value ? 'scale-120 ring-2 ring-indigo-500' : 'hover:scale-110'
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sticker stamps selector */}
          {toolMode === 'stamp' && (
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-455 uppercase tracking-wider mb-1.5">
                3. Choose Emoji Stamp
              </h4>
              <p className="text-[10px] text-slate-500 mb-2 leading-tight">
                Click a stamp below, then click anywhere on the blackboard!
              </p>
              <div className="grid grid-cols-4 gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                {STICKERS.map((stk) => (
                  <button
                    key={stk}
                    onClick={() => setSelectedSticker(stk)}
                    className={`text-xl p-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedSticker === stk ? 'bg-indigo-50 scale-110 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={clearBoard}
            className="w-full mt-auto py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Entire Board</span>
          </button>
        </div>

        {/* Right Blackboard/Whiteboard Area */}
        <div className="xl:col-span-3 p-4 bg-slate-100 relative min-h-[420px] flex flex-col">
          <div
            ref={containerRef}
            className={`w-full flex-1 relative rounded-2xl overflow-hidden cursor-crosshair border shadow-inner transition-all duration-300 ${
              boardType === 'blackboard'
                ? 'bg-emerald-950 border-emerald-900 chalkboard-grid'
                : 'bg-white border-slate-250 whiteboard-grid'
            }`}
          >
            {/* Canvas overlay */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 z-10 w-full h-full"
            />

            {/* Custom interactive stamps layer */}
            <div className="absolute inset-0 z-20 pointer-events-none select-none">
              {stickers.map((stk) => (
                <div
                  key={stk.id}
                  style={{
                    position: 'absolute',
                    left: `${stk.x}px`,
                    top: `${stk.y}px`,
                    fontSize: `${stk.size}px`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto'
                  }}
                  className="group relative cursor-pointer"
                  onClick={() => removeSticker(stk.id)}
                  title="Click to remove sticker stamp"
                >
                  <span className="relative z-10">{stk.value}</span>
                  <span className="hidden group-hover:flex absolute -top-4 -right-4 bg-red-500 text-white text-[9px] px-1 rounded-full font-mono font-bold leading-tight">
                    X
                  </span>
                </div>
              ))}
            </div>

            {/* Hint label in board corner */}
            <div className="absolute bottom-3 right-3 bg-slate-900/40 text-slate-350 text-[10px] px-2 py-1 rounded-md z-25 font-mono pointer-events-none">
              Mode: {toolMode === 'draw' ? 'Writing' : toolMode === 'erase' ? 'Erasing' : 'Stamp-overlay'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
