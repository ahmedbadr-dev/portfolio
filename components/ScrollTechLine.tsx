import React, { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'hero', code: '00', label: 'INIT' },
  { id: 'services', code: '01', label: 'SRV' },
  { id: 'work', code: '02', label: 'WRK' },
  { id: 'process', code: '03', label: 'PRC' },
  { id: 'stack', code: '04', label: 'STK' },
  { id: 'why', code: '05', label: 'WHY' },
  { id: 'contact', code: '06', label: 'CTA' },
] as const;

type NodeState = {
  id: string;
  code: string;
  label: string;
  top: number;
};

export default function ScrollTechLine() {
  const railRef = useRef<HTMLDivElement>(null);
  const [fillPx, setFillPx] = useState(0);
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [activeId, setActiveId] = useState('hero');
  const rafRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const rail = railRef.current;
      if (!rail) return;

      const scrollY = window.scrollY;
      const railTop = rail.getBoundingClientRect().top + scrollY;
      const railHeight = Math.max(1, rail.offsetHeight);
      const marker = scrollY + window.innerHeight * 0.42;

      const measured: NodeState[] = [];
      let current = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const sectionTop = el.getBoundingClientRect().top + scrollY;
        const top = Math.min(railHeight - 20, Math.max(20, sectionTop - railTop + 56));
        measured.push({ ...section, top });

        if (marker >= sectionTop) {
          current = section.id;
        }
      }

      setFillPx(Math.min(railHeight, Math.max(0, marker - railTop)));
      setNodes(measured);
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    const t = window.setTimeout(measure, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <aside
      className="scroll-tech-line pointer-events-none absolute inset-y-0 left-0 z-[1] hidden md:block w-16 lg:w-20"
      aria-hidden="true"
    >
      <div
        ref={railRef}
        className="scroll-tech-rail absolute left-4 lg:left-6 top-28 bottom-16 w-12"
      >
        <div className="scroll-tech-track absolute left-[5px] top-0 bottom-0 w-px" />

        <div
          className="scroll-tech-fill absolute left-[5px] top-0 w-px origin-top"
          style={{ height: fillPx }}
        />

        <div
          className="scroll-tech-head absolute left-[5px] -translate-x-1/2 -translate-y-1/2"
          style={{ top: fillPx }}
        />

        {nodes.map((node) => {
          const reached = fillPx >= node.top - 8;
          const isActive = activeId === node.id;

          return (
            <div
              key={node.id}
              className={`scroll-tech-node absolute left-0 flex items-center gap-2 -translate-y-1/2 ${
                isActive ? 'is-active' : ''
              } ${reached ? 'is-reached' : ''}`}
              style={{ top: node.top }}
            >
              <span className="scroll-tech-dot" />
              <span className="scroll-tech-meta hidden lg:flex flex-col leading-none font-mono">
                <span className="code">{node.code}</span>
                <span className="label">{node.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
