/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { memo } from 'react';
import { Cpu, Terminal } from 'lucide-react';

interface TechSliderCardProps {
  tech: string;
  index: number;
}

const TechSliderCard: React.FC<TechSliderCardProps> = ({ tech, index }) => {
  return (
    <div
      data-hover="true"
      className="group relative shrink-0 w-[200px] sm:w-[220px] md:w-[240px] h-[200px] md:h-[220px] overflow-hidden border border-white/15 bg-black select-none"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 4px)',
        }}
      />

      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/30 group-hover:border-white transition-colors" />

      <div className="relative z-10 h-full p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="p-2 border border-white/20 bg-zinc-950 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
            [{String(index + 1).padStart(2, '0')}]
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Terminal className="w-3 h-3 text-zinc-400" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              // SYS_LIB
            </p>
          </div>
          <h3 className="font-heading text-base md:text-lg font-bold uppercase text-white tracking-tight leading-snug">
            {tech}
          </h3>
          <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>READY</span>
            <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">[LOADED]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TechSliderCard);
