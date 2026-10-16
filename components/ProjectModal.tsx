/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Terminal, X } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS } from '../data/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onNavigate }) => {
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4 bg-black/85 backdrop-blur-md cursor-auto select-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="project-modal relative w-full h-[92dvh] md:h-auto md:max-h-[90vh] max-w-5xl bg-black border-t border-white/25 md:border overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black rounded-t-2xl md:rounded-none"
          >
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <span className="w-10 h-1 rounded-full bg-white/25" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2.5 border border-white/20 bg-black/90 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
              data-hover="true"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col md:flex-row md:overflow-hidden">
              <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-auto md:min-h-[420px] relative overflow-hidden bg-zinc-950 shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={project.id}
                    src={project.image}
                    alt={project.name}
                    width={800}
                    height={1000}
                    decoding="async"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 0.85, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black" />
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.1) 3px, rgba(255, 255, 255, 0.1) 4px)',
                  }}
                />
              </div>

              <div className="w-full md:w-1/2 px-5 pt-5 pb-4 md:p-12 flex flex-col justify-center relative bg-black">
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.04 }}
                >
                  <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                    <span className="font-mono text-[10px] sm:text-xs border border-white/30 bg-zinc-950 px-2 py-1 uppercase tracking-widest text-white">
                      {project.tag}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs text-zinc-500">
                      // ID: 0x0{project.id}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-4xl font-heading font-bold uppercase leading-none mb-2.5 text-white pr-8">
                    {project.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>// {project.category}</span>
                  </p>

                  <div className="h-px w-full bg-white/15 mb-4 md:mb-6" />

                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base font-light mb-5 md:mb-8">
                    {project.description}
                  </p>

                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-4 md:mb-6 inline-flex items-center justify-center gap-2 w-full py-3.5 border border-white bg-white text-black font-mono text-xs font-bold uppercase tracking-[0.2em] active:scale-[0.98] hover:bg-black hover:text-white transition-all duration-300"
                      data-hover="true"
                    >
                      [VISIT LIVE SITE →]
                    </a>
                  ) : null}

                  <div className="border border-white/10 bg-zinc-950 p-3.5 font-mono text-[10px] sm:text-[11px] text-zinc-500 flex justify-between items-center gap-3">
                    <span>STACK: PRODUCTION // SHIPPED</span>
                    <span className="text-white font-bold shrink-0">
                      {project.url ? '[LIVE]' : '[CASE_STUDY]'}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="md:hidden shrink-0 border-t border-white/15 bg-zinc-950 px-4 py-3 flex items-center justify-between gap-3 safe-pb">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className="flex items-center gap-2 px-3 py-2.5 bg-black text-white active:bg-white active:text-black active:scale-95 transition-colors border border-white/20 font-mono text-[10px] uppercase tracking-widest"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                Browse
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className="flex items-center gap-2 px-3 py-2.5 bg-black text-white active:bg-white active:text-black active:scale-95 transition-colors border border-white/20 font-mono text-[10px] uppercase tracking-widest"
                aria-label="Next Project"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop side nav */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('prev');
              }}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black text-white hover:bg-white hover:text-black transition-colors border border-white/20"
              data-hover="true"
              aria-label="Previous Project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('next');
              }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black text-white hover:bg-white hover:text-black transition-colors border border-white/20"
              data-hover="true"
              aria-label="Next Project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const navigateProjects = (
  current: Project,
  direction: 'next' | 'prev',
  list: Project[] = PROJECTS
): Project => {
  const currentIndex = list.findIndex((p) => p.id === current.id);
  if (direction === 'next') {
    return list[(currentIndex + 1) % list.length];
  }
  return list[(currentIndex - 1 + list.length) % list.length];
};

export default ProjectModal;
