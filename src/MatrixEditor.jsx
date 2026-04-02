import React, { useState } from 'react';
import MatrixCanvas from './MatrixCanvas';
import PreviewPlayer from './PreviewPlayer';
import TextScroller from './TextScroller';

const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 16;
const DEFAULT_COLOR = '#00FF41';

function createEmptyFrame(rows, cols, color = '#222') {
  return Array.from({ length: rows }, () => Array(cols).fill(color));
}

export default function MatrixEditor() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [frames, setFrames] = useState([createEmptyFrame(DEFAULT_ROWS, DEFAULT_COLS)]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setInterval] = useState(150);

  // --- 字幕滚动相关 ---
  const [inputText, setInputText] = useState('Hello!');
  const [fontSize, setFontSize] = useState(6);

  const addFrame = () => {
    setFrames([...frames, createEmptyFrame(rows, cols)]);
    setCurrentFrame(frames.length);
  };
  const removeFrame = () => {
    if (frames.length === 1) return;
    const arr = frames.slice();
    arr.splice(currentFrame, 1);
    setFrames(arr);
    setCurrentFrame(Math.max(0, currentFrame - 1));
  };

  const updateCell = (r, c) => {
    const arr = frames.slice();
    arr[currentFrame][r][c] = selectedColor;
    setFrames(arr);
  };

  const clearCurrent = () => {
    const arr = frames.slice();
    arr[currentFrame] = createEmptyFrame(rows, cols);
    setFrames(arr);
  };

  // --- 导出 JSON 格式动画数据 ---
  const exportData = () => {
    const data = { rows, cols, frames, interval };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matrix-anim.json';
    a.click();
  };

  // --- 滚动字幕动画生成 ---
  const handleGenerateText = () => {
    const gen = TextScroller(inputText, rows, cols, selectedColor, '#222', fontSize);
    setFrames(gen);
    setCurrentFrame(0);
  };


  return (
    <div style={{background:'#232733',padding:24,borderRadius:14,marginBottom:24}}>
      <div style={{marginBottom:12}}>
        行 rows: <input type="number" value={rows} min={1} max={32} onChange={e=>setRows(+e.target.value)}/>
        列 cols: <input type="number" value={cols} min={1} max={64} onChange={e=>setCols(+e.target.value)}/>
        &nbsp; 颜色 <input type="color" value={selectedColor} onChange={e=>setSelectedColor(e.target.value)} />
        <button onClick={clearCurrent}>清空帧</button>
        &nbsp;<button onClick={exportData}>导出动画数据</button>
      </div>
      <MatrixCanvas frame={frames[currentFrame]} onCellClick={updateCell} color={selectedColor} />
      <div style={{margin:'8px 0'}}>
        <button onClick={()=>setCurrentFrame(0)} disabled={currentFrame===0}>|&lt;</button>
        <button onClick={()=>setCurrentFrame(cur=>Math.max(0,cur-1))} disabled={currentFrame===0}>&lt;</button>
        帧 {currentFrame+1} / {frames.length}
        <button onClick={()=>setCurrentFrame(cur=>Math.min(frames.length-1,cur+1))} disabled={currentFrame===frames.length-1}>&gt;</button>
        <button onClick={()=>setCurrentFrame(frames.length-1)} disabled={currentFrame===frames.length-1}>&gt;|</button>
        <button onClick={addFrame}>新增帧</button>
        <button onClick={removeFrame} disabled={frames.length===1}>删除帧</button>
        &nbsp; 播放间隔(ms)
        <input style={{width:50}} type="number" min={20} max={2000} step={10} value={interval} onChange={e=>setInterval(+e.target.value)} />
        <button onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying?'暂停':'预览动画'}</button>
      </div>

      <PreviewPlayer frames={frames} playing={isPlaying} interval={interval} setFrame={setCurrentFrame} />
      <hr style={{margin:'20px 0',borderColor:'#444'}} />

      <div style={{background:'#1c2027',padding:14,borderRadius:8}}>
        <b>滚动字幕动画：</b>&nbsp;
        <input value={inputText} onChange={e=>setInputText(e.target.value)} maxLength={64} />
        字号: <input type="number" min={4} max={rows} value={fontSize} onChange={e=>setFontSize(+e.target.value)} style={{width:36}} />
        <button onClick={handleGenerateText}>生成字幕动画帧</button>
      </div>
    </div>
  );
}