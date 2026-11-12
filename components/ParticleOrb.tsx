/**
 * Interactive particle orb inspired by Motion's Particle Orb example.
 * Official source is Motion+ gated — this recreation uses canvas particles
 * + motion/react for entrance, sway, hover, and throw.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
};

type ParticleOrbProps = {
  logoSrc?: string;
  className?: string;
  size?: number;
};

function buildSphere(count: number): Particle[] {
  const pts: Particle[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: 0.7 + Math.random() * 1.4,
    });
  }
  return pts;
}

const ParticleOrb: React.FC<ParticleOrbProps> = ({
  logoSrc = '/logo.png',
  className = '',
  size = 420,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => buildSphere(900), []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 18 });
  const logoRotateY = useTransform(springX, [-0.6, 0.6], [-18, 18]);
  const logoRotateX = useTransform(springY, [-0.6, 0.6], [14, -14]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let running = true;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const side = canvas.clientWidth;
      canvas.width = Math.floor(side * dpr);
      canvas.height = Math.floor(side * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(Math.max(-1, Math.min(1, nx)));
      mouseY.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;
      t += reduce ? 0.004 : 0.008;

      const tiltX = springY.get() * 0.55;
      const tiltY = springX.get() * 0.7;
      const rotY = t * 0.55 + tiltY;
      const rotX = 0.35 + tiltX;

      ctx.clearRect(0, 0, w, h);

      // Soft aura
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
      glow.addColorStop(0, 'rgba(255,255,255,0.08)');
      glow.addColorStop(0.55, 'rgba(255,255,255,0.02)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      const projected: { x: number; y: number; z: number; size: number }[] = [];
      for (const p of particles) {
        // rotate Y
        let x = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
        let y = p.y;
        // rotate X
        const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
        y = y2;
        z = z2;
        projected.push({ x, y, z, size: p.size });
      }
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const depth = (p.z + 1) * 0.5;
        const px = cx + p.x * radius;
        const py = cy + p.y * radius;
        const alpha = 0.18 + depth * 0.82;
        const s = p.size * (0.55 + depth * 0.9);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.arc(px, py, s, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [mouseX, mouseY, particles, springX, springY]);

  return (
    <motion.div
      ref={wrapRef}
      className={`relative select-none aspect-square ${className}`}
      style={
        className.includes('w-') || className.includes('h-')
          ? { maxWidth: '100%' }
          : { width: size, height: size, maxWidth: '100%' }
      }
      initial={{ opacity: 0, scale: 0.72, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      drag
      dragElastic={0.35}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragTransition={{ bounceStiffness: 280, bounceDamping: 18 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: logoRotateX,
          rotateY: logoRotateY,
          transformPerspective: 800,
        }}
      >
        <motion.img
          src={logoSrc}
          alt="Ahmed Badr logo"
          width={120}
          height={120}
          draggable={false}
          className="h-[28%] w-[28%] object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ParticleOrb;
