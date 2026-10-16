/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, Terminal } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      className="group relative h-[420px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/15 bg-black cursor-pointer select-none"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* CSS transitions for filter/scale — cheaper than Framer animating filter strings */}
        <img
          src={project.image}
          alt={project.name}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover project-card-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 group-hover:via-black/20 transition-all duration-500" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.05) 3px, rgba(255, 255, 255, 0.05) 4px)',
          }}
        />
      </div>

      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />

      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest border border-white/30 bg-black/90 px-3 py-1 text-white shadow-sm">
              {project.tag}
            </span>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-1 border border-white/10">
              0x0{project.id}
            </span>
          </div>

          <motion.div
            variants={{
              rest: { opacity: 0.6, scale: 0.9 },
              hover: { opacity: 1, scale: 1.1 },
            }}
            className="bg-white text-black rounded-full p-2 shadow-lg transition-transform"
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <motion.p
              className="text-xs font-mono uppercase tracking-widest text-zinc-400"
              variants={{
                rest: { opacity: 0.8 },
                hover: { opacity: 1 },
              }}
            >
              // {project.category}
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.h3
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white tracking-tight drop-shadow-md"
              variants={{
                rest: { y: 0 },
                hover: { y: -3 },
              }}
              transition={{ duration: 0.3 }}
            >
              {project.name}
            </motion.h3>
          </div>

          <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.description}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>STATUS: SHIPPED</span>
            <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">
              {project.url ? '[LIVE_SITE]' : '[VIEW_CASE]'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectCard);
