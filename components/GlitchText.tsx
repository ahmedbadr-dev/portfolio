/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate select-none ${className}`}>
      <span className="absolute inset-0 z-10 block glitch-shine" aria-hidden="true">
        {text}
      </span>

      <span className="absolute inset-0 z-20 block text-white pointer-events-none glitch-slice-a" aria-hidden="true">
        {text}
      </span>

      <span className="absolute inset-0 z-20 block text-zinc-400 pointer-events-none glitch-slice-b" aria-hidden="true">
        {text}
      </span>

      <span
        className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 opacity-60"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      <span
        className="absolute inset-0 -z-10 block bg-gradient-to-r from-white/30 via-zinc-400/20 to-white/30 bg-clip-text text-transparent blur-xl opacity-30"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
        }}
        aria-hidden="true"
      >
        {text}
      </span>
    </Component>
  );
};

export default React.memo(GlitchText);
