import React from 'react';
import MatrixEditor from './MatrixEditor';

export default function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 24 }}>
      <h1>Matrix Animator <span style={{fontSize:16}}>矩阵动画编辑器</span></h1>
      <MatrixEditor />
      <footer style={{marginTop:32, fontSize:13, color:'#888'}}>
        <p>Made by SenvenQi using React · 支持自定义矩阵与字幕滚动动画</p>
      </footer>
    </div>
  );
}