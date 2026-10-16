/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, type PanInfo } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Terminal } from 'lucide-react';
import { Project } from '../types';

interface WorkCoverflowProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const CARD_W = 420;
const CARD_H = 236;
const STEP = 260;
const ROTATE = 42;
const SPRING = { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.9 };
const DRAG_CLICK_SUPPRESS_PX = 6;
const SWIPE_DISTANCE = 36;
const SWIPE_VELOCITY = 200;
const AUTO_SLIDE_MS = 3000;

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function loopOffset(index: number, active: number, len: number) {
  let offset = index - active;
  if (offset > len / 2) offset -= len;
  if (offset < -len / 2) offset += len;
  return offset;
}

const WorkCoverflow: React.FC<WorkCoverflowProps> = ({ projects, onSelect }) => {
  const len = projects.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);
  const suppressClick = useRef(false);
  const dragging = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  const go = useCallback(
    (next: number) => {
      setActive(wrapIndex(next, len));
      animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 40 });
    },
    [dragX, len]
  );

  useEffect(() => {
    if (paused || len < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = window.setInterval(() => {
      if (document.hidden || dragging.current) return;
      go(activeRef.current + 1);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [go, len, paused]);

  const markDragged = (info: PanInfo) => {
    if (
      Math.abs(info.offset.x) > DRAG_CLICK_SUPPRESS_PX ||
      Math.abs(info.offset.y) > DRAG_CLICK_SUPPRESS_PX
    ) {
      suppressClick.current = true;
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    dragging.current = false;
    markDragged(info);
    const flicked = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) * 1.25) {
      animate(dragX, 0, SPRING);
      return;
    }
    if (info.offset.x < -SWIPE_DISTANCE || (flicked && info.velocity.x < 0)) {
      go(active + 1);
    } else if (info.offset.x > SWIPE_DISTANCE || (flicked && info.velocity.x > 0)) {
      go(active - 1);
    } else {
      animate(dragX, 0, SPRING);
    }
  };

  const handleCardActivate = (project: Project, index: number, isActive: boolean) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (isActive) onSelect(project);
    else go(index);
  };

  return (
    <div
      className="work-coverflow relative border-y border-white/15 bg-black/80 overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-black via-black/80 to-transparent" />

      <div
        role="listbox"
        aria-label="Selected projects gallery"
        aria-activedescendant={`work-card-${projects[active]?.id}`}
        className="relative h-[300px] md:h-[340px] outline-none py-4"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-30">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => go(active - 1)}
            data-hover="true"
            className="w-9 h-9 border border-white/20 bg-black/80 text-white flex items-center justify-center hover:border-white/50 hover:bg-white hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-30">
          <button
            type="button"
            aria-label="Next project"
            onClick={() => go(active + 1)}
            data-hover="true"
            className="w-9 h-9 border border-white/20 bg-black/80 text-white flex items-center justify-center hover:border-white/50 hover:bg-white hover:text-black transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            perspective: 1100,
            x: dragX,
            touchAction: 'pan-y',
          }}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.22}
          dragPropagation={false}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDrag={(_, info) => markDragged(info)}
          onDragEnd={onDragEnd}
        >
          {projects.map((project, i) => {
            const offset = loopOffset(i, active, len);
            const abs = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <motion.button
                key={project.id}
                id={`work-card-${project.id}`}
                type="button"
                role="option"
                aria-selected={isActive}
                data-hover="true"
                onClick={() => handleCardActivate(project, i, isActive)}
                className="group absolute top-1/2 left-1/2 overflow-hidden border border-white/15 bg-black p-0 text-left select-none will-change-transform cursor-grab active:cursor-grabbing"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  transformStyle: 'preserve-3d',
                  pointerEvents: abs > 3 ? 'none' : 'auto',
                  touchAction: 'pan-y',
                }}
                initial={false}
                animate={{
                  x: offset * STEP,
                  rotateY: offset * -ROTATE,
                  scale: isActive ? 1 : Math.max(0.72, 0.92 - abs * 0.06),
                  z: isActive ? 80 : -abs * 90,
                  opacity: abs > 3 ? 0 : 1 - abs * 0.12,
                  zIndex: len - abs,
                }}
                transition={SPRING}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    width={840}
                    height={472}
                    loading={abs <= 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover project-card-img pointer-events-none"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15 transition-opacity duration-300 ${
                      isActive ? 'opacity-90' : 'opacity-100'
                    }`}
                  />
                </div>

                <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/30" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/30" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/30" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/30" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-mono font-bold tracking-widest border border-white/30 bg-black/90 px-2 py-0.5 text-white">
                      {project.tag}
                    </span>
                    <span
                      className={`bg-white text-black rounded-full p-1.5 transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Terminal className="w-3 h-3 text-zinc-400" />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                        // {project.category}
                      </p>
                    </div>
                    <h3 className="font-heading text-base md:text-lg font-bold uppercase text-white tracking-tight leading-snug line-clamp-2">
                      {project.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>SHIPPED</span>
                      <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">
                        {project.url ? '[LIVE]' : '[VIEW]'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default WorkCoverflow;
