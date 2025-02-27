import React, { useRef, useState, useEffect } from 'react';
import { Palette, Save, Download, RefreshCw, Eraser, Square, Circle, Minus, Plus } from 'lucide-react';

const DrawingCanvas = ({ width = 800, height = 600, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush'); // brush, eraser, square, circle
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Colors available for user selection
  const colors = [
    '#ffffff', '#f87171', '#60a5fa', '#4ade80', 
    '#fbbf24', '#c084fc', '#a1a1aa', '#000000'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas background to a dark color
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    // Save initial state to history
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    // If we're not at the end of the history, trim it
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    setHistory([...history.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(historyIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = tool === 'eraser' ? '#1e293b' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    } else if (tool === 'square' || tool === 'circle') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      // Store starting point for shape drawing
      canvas.startX = x;
      canvas.startY = y;
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'square' || tool === 'circle') {
      // For shapes, we'll redraw from the stored image data
      if (history.length > 0) {
        const img = new Image();
        img.src = history[historyIndex];
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
      }
      
      const startX = canvas.startX;
      const startY = canvas.startY;
      
      ctx.strokeStyle = color;
      ctx.beginPath();
      
      if (tool === 'square') {
        ctx.rect(startX, startY, x - startX, y - startY);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      }
      
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSave && typeof onSave === 'function') {
      onSave(dataUrl);
    } else {
      // Default save behavior - trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'drawing.png';
      link.click();
    }
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Reset to dark background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    saveToHistory();
  };

  const changeBrushSize = (amount) => {
    setBrushSize(Math.max(1, Math.min(50, brushSize + amount)));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Tool selection */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setTool('brush')}
              className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
              title="Brush"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setTool('eraser')}
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
              title="Eraser"
            >
              <Eraser className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setTool('square')}
              className={`p-2 rounded ${tool === 'square' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
              title="Square"
            >
              <Square className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setTool('circle')}
              className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
              title="Circle"
            >
              <Circle className="h-5 w-5" />
            </button>
          </div>

          {/* Brush size controls */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => changeBrushSize(-1)}
              className="p-2 bg-white/10 rounded hover:bg-white/20"
              title="Decrease brush size"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-sm">{brushSize}px</span>
            <button 
              onClick={() => changeBrushSize(1)}
              className="p-2 bg-white/10 rounded hover:bg-white/20"
              title="Increase brush size"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* History controls */}
          <div className="flex space-x-2">
            <button 
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded ${historyIndex <= 0 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
              title="Undo"
            >
              Undo
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded ${historyIndex >= history.length - 1 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
              title="Redo"
            >
              Redo
            </button>
          </div>

          <div className="flex-grow"></div>

          {/* Action buttons */}
          <button 
            onClick={handleClearCanvas}
            className="p-2 bg-white/10 rounded hover:bg-white/20"
            title="Clear canvas"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button 
            onClick={handleSaveCanvas}
            className="p-2 bg-blue-600 rounded hover:bg-blue-700"
            title="Save drawing"
          >
            <Save className="h-5 w-5" />
          </button>
        </div>
        
        {/* Color palette */}
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-white/50" />
          <div className="flex space-x-2">
            {colors.map((c) => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 bg-transparent cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-2 flex justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair rounded-lg"
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;