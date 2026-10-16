/**
 * Interactive hero mascot — glasses character from page-mascot (vanilla).
 * Loaded via script tag (UMD) so Vite ESM bundling can't break the export.
 * @see https://github.com/Devhub-Solutions/page-mascot-html
 */

import React, { useEffect, useRef } from 'react';

interface HeroMascotProps {
  size?: number;
  className?: string;
}

type PageMascotApi = {
  createMascot: (
    host: HTMLElement,
    options: {
      directions: string;
      reactions: string;
      size?: number;
      label?: string;
      className?: string;
    }
  ) => { destroy: () => void };
};

declare global {
  interface Window {
    PageMascot?: PageMascotApi;
  }
}

let scriptPromise: Promise<PageMascotApi> | null = null;

function loadPageMascot(): Promise<PageMascotApi> {
  if (typeof window !== 'undefined' && window.PageMascot?.createMascot) {
    return Promise.resolve(window.PageMascot);
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-page-mascot]');
      if (existing) {
        existing.addEventListener('load', () => {
          if (window.PageMascot) resolve(window.PageMascot);
          else reject(new Error('PageMascot missing after script load'));
        });
        existing.addEventListener('error', () => reject(new Error('Failed to load page-mascot.js')));
        if (window.PageMascot) resolve(window.PageMascot);
        return;
      }

      const script = document.createElement('script');
      script.src = '/page-mascot.js';
      script.async = true;
      script.dataset.pageMascot = 'true';
      script.onload = () => {
        if (window.PageMascot?.createMascot) resolve(window.PageMascot);
        else reject(new Error('PageMascot API not found on window'));
      };
      script.onerror = () => reject(new Error('Failed to load page-mascot.js'));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

const HeroMascot: React.FC<HeroMascotProps> = ({ size = 128, className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let mascot: { destroy: () => void } | null = null;

    loadPageMascot()
      .then((api) => {
        if (cancelled || !hostRef.current) return;
        host.innerHTML = '';
        mascot = api.createMascot(host, {
          directions: '/mascots/kamran-directions.webp',
          reactions: '/mascots/kamran-reactions.webp',
          size,
          label: 'Ahmed',
          className: className.includes('footer-mascot') ? 'hero-mascot-btn footer-mascot-btn' : 'hero-mascot-btn',
        });
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      cancelled = true;
      mascot?.destroy();
      if (host) host.innerHTML = '';
    };
  }, [size, className]);

  return (
    <div
      ref={hostRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={false}
    />
  );
};

export default React.memo(HeroMascot);
