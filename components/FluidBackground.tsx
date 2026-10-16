/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useMemo, useRef } from 'react';

interface GridPulse {
  id: number;
  col: number;
  row: number;
  delay: number;
}

const TechGridBackground: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -500, y: -500 });

  const pulses: GridPulse[] = useMemo(
    () =>
      [
        [2, 1, 0.4],
        [5, 2, 1.2],
        [8, 1, 2.1],
        [11, 3, 0.8],
        [3, 4, 3.0],
        [7, 5, 1.7],
        [10, 4, 2.6],
        [4, 6, 0.2],
        [9, 7, 3.5],
        [1, 3, 4.1],
        [6, 2, 2.9],
        [12, 6, 1.0],
      ].map(([col, row, delay], i) => ({ id: i, col, row, delay })),
    []
  );

  useEffect(() => {
    const spotlight = spotlightRef.current;
    const root = rootRef.current;
    if (!spotlight || !root) return;

    const flushMouse = () => {
      rafRef.current = null;
      const { x, y } = mouseRef.current;
      spotlight.style.background = `radial-gradient(720px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.04) 32%, transparent 62%)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flushMouse);
      }
    };

    const handleVisibility = () => {
      root.classList.toggle('bg-paused', document.hidden);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-black select-none pointer-events-none tech-grid-bg"
      style={{ contain: 'strict' }}
    >
      <div className="absolute inset-0 bg-[#000000]" />

      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '160px 160px',
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden="true">
        <defs>
          <pattern id="tech-crosshair-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="152" y1="0" x2="160" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="0" y1="160" x2="8" y2="160" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="152" y1="160" x2="160" y2="160" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="0" y1="152" x2="0" y2="160" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="160" y1="0" x2="160" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <line x1="160" y1="152" x2="160" y2="160" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
            <circle cx="80" cy="80" r="1" fill="rgba(255,255,255,0.25)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tech-crosshair-pattern)" />
      </svg>

      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(720px circle at -500px -500px, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.04) 32%, transparent 62%)',
        }}
      />

      <div className="tech-scanline absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none opacity-60 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />

      <div className="absolute inset-0 overflow-hidden">
        {pulses.map((p) => (
          <div
            key={p.id}
            className="tech-pulse absolute w-1.5 h-1.5 bg-white rounded-full pointer-events-none"
            style={{
              left: `${p.col * 160}px`,
              top: `${p.row * 160}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hidden lg:block absolute top-24 left-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
        <span className="text-zinc-400 font-bold">[SYS_V2.5]</span> GRID_COORD: 0x88F // ACTIVE
      </div>
      <div className="hidden lg:block absolute top-24 right-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase text-right">
        RADAR: RUNNING <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping ml-1" />
      </div>
      <div className="hidden lg:block absolute bottom-8 left-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
        LAT: 35.6762°N // LON: 139.6503°E // BIND: 0.0.0.0:3000
      </div>
      <div className="hidden lg:block absolute bottom-8 right-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase text-right">
        RENDER: MONOCHROME // MATRIX: 32x32
      </div>

      <div className="absolute inset-0 pointer-events-none tech-vignette" />
    </div>
  );
};

export default React.memo(TechGridBackground);
