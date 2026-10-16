/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { memo } from 'react';
import { ArrowUpRight, Terminal } from 'lucide-react';
import { Project } from '../types';

interface ProjectSliderCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectSliderCard: React.FC<ProjectSliderCardProps> = ({ project, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-hover="true"
      className="group relative shrink-0 w-[240px] sm:w-[260px] md:w-[280px] h-[300px] md:h-[320px] overflow-hidden border border-white/15 bg-black cursor-pointer select-none text-left p-0 active:scale-[0.985] active:border-white/40 transition-transform duration-150 touch-manipulation"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          width={560}
          height={640}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover project-card-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 group-hover:via-black/25 transition-all duration-500" />
      </div>

      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/30 group-hover:border-white transition-colors" />

      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[9px] font-mono font-bold tracking-widest border border-white/30 bg-black/90 px-2 py-0.5 text-white">
            {project.tag}
          </span>
          <span className="bg-white text-black rounded-full p-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
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
    </button>
  );
};

export default memo(ProjectSliderCard);
