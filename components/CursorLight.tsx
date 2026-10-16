/**
 * Soft light gradient that follows the cursor.
 * Desktop / fine-pointer only — no custom cursor, no mobile drain.
 */

import React, { useEffect, useRef } from 'react';

const CursorLight: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -999, y: -999, hover: false });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const glow = glowRef.current;
    if (!glow) return;

    const flush = () => {
      rafRef.current = null;
      const { x, y, hover } = posRef.current;
      const size = hover ? 520 : 420;
      const core = hover ? 0.2 : 0.12;
      const mid = hover ? 0.08 : 0.045;
      glow.style.background = `
        radial-gradient(${size}px circle at ${x}px ${y}px,
          rgba(255, 255, 255, ${core}) 0%,
          rgba(255, 255, 255, ${mid}) 28%,
          rgba(255, 255, 255, 0.015) 48%,
          transparent 68%
        )
      `;
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hover = Boolean(
        target?.closest?.(
          'a, button, [data-hover="true"], [role="button"], input, textarea, label'
        )
      );
      posRef.current = { x: e.clientX, y: e.clientY, hover };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flush);
      }
    };

    const onLeave = () => {
      posRef.current = { x: -999, y: -999, hover: false };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flush);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    flush();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-light pointer-events-none fixed inset-0 z-[25] hidden md:block"
      aria-hidden="true"
    />
  );
};

export default React.memo(CursorLight);
