import React, { useEffect } from 'react';

export default function PreviewPlayer({ frames, playing, interval, setFrame }) {
  useEffect(()=>{
    if (!playing) return;
    const timer = setInterval(()=>{
      setFrame(f => {
        const next = f + 1;
        return next >= frames.length ? 0 : next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [playing, frames.length, interval, setFrame]);
  return null;
}