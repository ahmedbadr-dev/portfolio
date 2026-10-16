/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Globe, Menu, X, Terminal, Shield, Cpu, Cloud, Boxes, Smartphone, Sparkles, LayoutGrid, Search, PenTool, Code2, Rocket, Briefcase, Layers, Scaling, Github } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import CursorLight from './components/CursorLight';
import GlitchText from './components/GlitchText';
import WorkCoverflow from './components/WorkCoverflow';
import TechSliderCard from './components/TechSliderCard';
import ProjectModal, { navigateProjects } from './components/ProjectModal';
import HeroMascot from './components/HeroMascot';
import ScrollTechLine from './components/ScrollTechLine';
import { Reveal, FloatingCard, SectionShell } from './components/Reveal';
import { Project } from './types';
import { PROJECTS } from './data/projects';

const AIChat = lazy(() => import('./components/AIChat'));

const WHY_ME = [
  {
    code: '01',
    title: 'Business First',
    description: 'Technology should solve a real business problem, not add unnecessary complexity.',
    icon: Briefcase,
    tag: 'STRATEGY',
  },
  {
    code: '02',
    title: 'Modern UX',
    description: 'Clean, intuitive interfaces designed around how people actually use products.',
    icon: Sparkles,
    tag: 'EXPERIENCE',
  },
  {
    code: '03',
    title: 'Full-Stack Execution',
    description: 'Frontend, backend, databases, APIs, authentication, dashboards, and integrations.',
    icon: Layers,
    tag: 'EXECUTION',
  },
  {
    code: '04',
    title: 'Built to Scale',
    description: 'Architecture designed with future users, features, and growth in mind.',
    icon: Scaling,
    tag: 'GROWTH',
  },
];

const TECH_STACK = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Firebase',
  'REST APIs',
  'React Native',
  'Flutter',
  'Tailwind CSS',
  'MongoDB',
  'PostgreSQL',
  'AI APIs',
];

const WORKFLOW = [
  {
    code: '01',
    title: 'Understand',
    description: 'I start by understanding the business, users, and the problem the product needs to solve.',
    icon: Search,
  },
  {
    code: '02',
    title: 'Design',
    description: 'I translate requirements into a clear user experience and modern interface.',
    icon: PenTool,
  },
  {
    code: '03',
    title: 'Build',
    description: 'I develop the product with a focus on performance, scalability, security, and maintainability.',
    icon: Code2,
  },
  {
    code: '04',
    title: 'Launch',
    description: 'I help prepare the product for production and make sure the final experience works across devices and platforms.',
    icon: Rocket,
  },
];

// Digital Product Domains for Scroll Showcase
const PRODUCT_TYPES = [
  {
    title: 'Digital Products',
    tagline: 'From complex business processes to simple, powerful digital experiences.',
    label: 'DIGITAL PRODUCTS',
  },
  {
    title: 'Web Platforms',
    tagline: 'High-performance web platforms, interactive portals & responsive web systems.',
    label: 'WEB PLATFORMS',
  },
  {
    title: 'SaaS Products',
    tagline: 'Scalable multi-tenant cloud software, billing systems & automated recurring pipelines.',
    label: 'SAAS PRODUCTS',
  },
  {
    title: 'ERP & CRM Systems',
    tagline: 'Enterprise resource planning, CRM pipelines, business automation & analytics.',
    label: 'ERP & CRM SYSTEMS',
  },
  {
    title: 'Mobile Applications',
    tagline: 'Native & cross-platform iOS & Android mobile applications engineered for fluid touch.',
    label: 'MOBILE APPLICATIONS',
  },
];

const SERVICES = [
  {
    code: '01',
    title: 'SaaS Products',
    tag: 'CLOUD_NATIVE',
    description: 'Scalable web applications designed around subscriptions, users, permissions, dashboards, and business workflows.',
    icon: Cloud,
  },
  {
    code: '02',
    title: 'ERP & CRM Systems',
    tag: 'ENTERPRISE_OPS',
    description: 'Custom management platforms that help businesses organize operations, customers, sales, inventory, and teams.',
    icon: Boxes,
  },
  {
    code: '03',
    title: 'Web Applications',
    tag: 'WEB_PLATFORM',
    description: 'Modern, responsive web platforms built around real business requirements and user experience.',
    icon: Globe,
  },
  {
    code: '04',
    title: 'Mobile Applications',
    tag: 'CROSS_PLATFORM',
    description: 'Cross-platform mobile apps with modern interfaces, APIs, authentication, notifications, and production-ready architecture.',
    icon: Smartphone,
  },
  {
    code: '05',
    title: 'AI-Powered Products',
    tag: 'INTELLIGENT_SYS',
    description: 'AI assistants, automation workflows, intelligent features, and AI-powered business tools.',
    icon: Sparkles,
  },
];

const App: React.FC = () => {
  const [productIndex, setProductIndex] = useState(0);

  // Ambient product-type rotation in the hero
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;
      setProductIndex((prev) => (prev + 1) % PRODUCT_TYPES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Pause CSS-driven loops when the tab is hidden
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => root.classList.toggle('bg-paused', document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigateProject = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;
    setSelectedProject(navigateProjects(selectedProject, direction, PROJECTS));
  };
  
  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      <FluidBackground />
      <CursorLight />
      <Suspense fallback={null}>
        <AIChat />
      </Suspense>
      <ScrollTechLine />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-black/85 backdrop-blur-xl border-b border-white/10 gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 md:flex-none">
          <img 
            src="https://i.postimg.cc/c41Scr6T/e2b8b958-7dd0-4094-8729-010da159b947.png" 
            alt="Logo" 
            className="w-8 h-8 md:w-9 md:h-9 object-contain rounded border border-white/20 p-0.5 bg-black shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="md:hidden min-w-0 flex flex-col leading-tight">
            <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase truncate">
              AHMED BADR
            </span>
            <span className="font-mono text-[8px] text-zinc-500 tracking-wider uppercase truncate">
              // Digital Product Developer
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[11px] text-zinc-500 tracking-widest uppercase border border-white/10 px-2 py-0.5 bg-zinc-950">
            // 0x2015.SYS
          </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-xs font-mono font-medium tracking-widest uppercase">
          {[
            { label: '// 01.SERVICES', id: 'services' },
            { label: '// 02.WORK', id: 'work' },
            { label: '// 03.PROCESS', id: 'process' },
            { label: '// 04.STACK', id: 'stack' },
            { label: '// 05.WHY', id: 'why' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)}
              className="hover:text-white text-zinc-400 transition-colors cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollToSection('stack')}
          className="hidden md:inline-block border border-white/30 bg-black px-6 py-2.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer"
          data-hover="true"
        >
          [TECH_STACK]
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center border border-white/20 bg-zinc-950 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
           {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-7 md:hidden border-b border-white/20"
          >
            <div className="flex items-center justify-center mb-2">
              <img 
                src="https://i.postimg.cc/c41Scr6T/e2b8b958-7dd0-4094-8729-010da159b947.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain rounded border border-white/20 p-1 bg-zinc-950"
                referrerPolicy="no-referrer"
              />
            </div>
            {[
              { label: '// SERVICES', id: 'services' },
              { label: '// WORK', id: 'work' },
              { label: '// PROCESS', id: 'process' },
              { label: '// STACK', id: 'stack' },
              { label: '// WHY', id: 'why' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-3xl font-heading font-bold text-white hover:text-zinc-400 transition-colors uppercase bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('stack')}
              className="mt-6 border border-white px-8 py-3 text-xs font-mono font-bold tracking-widest uppercase bg-white text-black"
            >
              [TECH_STACK]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header id="hero" className="relative h-[100svh] min-h-[640px] flex flex-col items-center justify-between overflow-hidden px-4 pt-20 pb-3">
          <div className="z-10 text-center flex flex-col items-center w-full max-w-5xl my-auto">
            {/* Interactive mascot (glasses character) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-4 relative flex items-center justify-center"
            >
              <div className="relative p-2 rounded-2xl border border-white/20 bg-zinc-950/90 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                <HeroMascot size={128} />
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white" />
              </div>
            </motion.div>

            {/* Engineer Identity Pill — desktop only; mobile shows in header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="hidden md:flex items-center gap-2.5 text-xs md:text-sm font-mono text-zinc-300 tracking-wider uppercase mb-3 bg-black/90 px-4 py-1.5 border border-white/20 shadow-2xl backdrop-blur-md"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="font-bold text-white tracking-widest">AHMED BADR</span>
              <span className="text-zinc-600">//</span>
              <span className="text-zinc-400">DIGITAL PRODUCT DEVELOPER</span>
            </motion.div>

            {/* Main Headline & Subtitle with Single-Line Dynamic Scroll Rotation */}
            <div className="relative w-full flex flex-col justify-center items-center px-2 mb-1.5">
              <h1 className="text-[5.4vw] sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white leading-tight text-center whitespace-nowrap flex items-center justify-center gap-2 sm:gap-3">
                <GlitchText text="Build" className="text-[5.4vw] sm:text-4xl md:text-5xl lg:text-6xl" />
                <span className="relative inline-flex items-center justify-center overflow-hidden h-[1.3em] align-middle">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={PRODUCT_TYPES[productIndex].title}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{
                        y: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.65, ease: 'easeInOut' },
                      }}
                      className="inline-block"
                    >
                      <GlitchText
                        text={PRODUCT_TYPES[productIndex].title}
                        className="text-[5.4vw] sm:text-4xl md:text-5xl lg:text-6xl"
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-base md:text-lg lg:text-xl font-heading font-medium tracking-normal text-zinc-400 text-center">
                That Move Businesses Forward.
              </p>
              {/* Ambient monochrome glow */}
              <div
                 className="absolute -z-20 w-[55vw] h-[55vw] bg-white/5 blur-[80px] rounded-full pointer-events-none hero-glow"
              />
            </div>
            
            <motion.div
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
               className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-3"
            />

            {/* Dynamic Product Tagline */}
            <div className="min-h-7 flex items-center justify-center px-4 mt-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={PRODUCT_TYPES[productIndex].tagline}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xs sm:text-sm md:text-base font-mono text-zinc-300 max-w-2xl mx-auto tracking-wide text-center"
                >
                  {PRODUCT_TYPES[productIndex].tagline}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
              <button
                onClick={() => scrollToSection('work')}
                className="px-7 py-3 bg-white text-black font-mono text-xs sm:text-sm font-bold tracking-widest uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.18)] cursor-pointer flex items-center gap-2"
                data-hover="true"
              >
                <span>[VIEW MY WORK]</span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-7 py-3 bg-black text-white font-mono text-xs sm:text-sm font-bold tracking-widest uppercase border border-white/30 hover:border-white hover:bg-zinc-950 transition-all duration-300 cursor-pointer flex items-center gap-2"
                data-hover="true"
              >
                <span>[START A PROJECT]</span>
              </button>
            </motion.div>

            {/* Scroll Indicator Telemetry */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>STAGE: 0{productIndex + 1} / 05</span>
              <span>//</span>
              <span>SCROLL_TO_EXPLORE_SERVICES</span>
              <span className="inline-block animate-bounce">↓</span>
            </div>
          </div>

          {/* TECH MARQUEE */}
          <div className="w-full py-2 bg-black text-white z-20 overflow-hidden border-y border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.9)]">
            <div className="flex w-fit marquee-track">
              {[0, 1].map((key) => (
                <div key={key} className="flex whitespace-nowrap shrink-0">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="text-xs sm:text-sm md:text-base font-mono font-bold px-8 flex items-center gap-5 tracking-widest text-zinc-300">
                      <span>MODERN_WEB_PLATFORMS</span>
                      <span className="text-zinc-600">//</span>
                      <span>SAAS_PRODUCTS</span>
                      <span className="text-zinc-600">//</span>
                      <span>ERP_&amp;_CRM_SYSTEMS</span>
                      <span className="text-zinc-600">//</span>
                      <span>MOBILE_APPLICATIONS</span>
                      <span className="text-zinc-600">[0x0{i+1}]</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
      </header>

      {/* SERVICES SECTION */}
      <SectionShell id="services" className="relative z-10 py-20 md:py-32 border-t border-white/15 overflow-hidden">
        <div className="absolute top-1/3 left-[-8%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 px-4">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                <span>// [MODULE_01] :: SERVICE_MATRIX</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] text-white tracking-tight">
                What I <br/>
                <GlitchText text="BUILD" className="text-5xl md:text-8xl" />
              </h2>
            </div>

            <div className="mt-4 md:mt-0 font-mono text-xs text-zinc-400 border border-white/10 px-4 py-2 bg-zinc-950">
              CAPABILITIES: 05 // STATUS: ONLINE
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/15 bg-black/80 backdrop-blur-md">
            {SERVICES.map((service, i) => (
              <FloatingCard key={service.code} index={i} className="h-full">
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group relative min-h-[320px] md:min-h-[360px] p-7 md:p-8 border-b border-r border-white/15 bg-black cursor-pointer select-none overflow-hidden h-full"
                data-hover="true"
              >
                {/* Scanline texture on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 4px)'
                  }}
                />

                {/* Tech corner accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 border border-white/20 bg-zinc-950 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 tracking-widest">[{service.code}]</span>
                      <span className="text-[10px] font-mono text-zinc-400 border border-white/15 px-2 py-0.5 bg-black">
                        {service.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        // CAPABILITY_{service.code}
                      </span>
                    </div>

                    <motion.h3
                      className="font-heading text-2xl md:text-3xl font-bold uppercase text-white tracking-tight mb-4"
                      variants={{
                        rest: { y: 0 },
                        hover: { y: -3 }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                    </motion.h3>

                    <p className="text-sm text-zinc-400 leading-relaxed font-light mb-6">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>SIG_STRENGTH: 99.{service.code}%</span>
                      <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">[DEPLOY_READY]</span>
                    </div>
                  </div>
                </div>

                {/* Top hairline */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/40 transition-all duration-500" />
              </motion.div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* SELECTED WORK SECTION */}
      <SectionShell id="work" className="relative z-10 pt-20 md:pt-32 pb-12 md:pb-16 overflow-x-clip">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-6 px-4">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>// [MODULE_02] :: PROJECT_ARCHIVE</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] text-white tracking-tight">
                Selected <br/>
                <GlitchText text="WORK" className="text-5xl md:text-8xl" />
              </h2>
              <p className="mt-4 text-sm md:text-base font-mono text-zinc-400 tracking-wide">
                Selected Projects
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={28}>
          <WorkCoverflow projects={PROJECTS} onSelect={setSelectedProject} />
        </Reveal>
      </SectionShell>

      {/* HOW I WORK SECTION */}
      <SectionShell id="process" className="relative z-10 py-20 md:py-32 bg-black/90 backdrop-blur-md border-t border-white/15 overflow-hidden">
        <div className="absolute top-1/2 right-[-10%] w-[45vw] h-[45vw] bg-white/5 rounded-full blur-[70px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 px-4">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>// [MODULE_03] :: WORKFLOW_PIPELINE</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] text-white tracking-tight">
                How I <br/>
                <GlitchText text="WORK" className="text-5xl md:text-8xl" />
              </h2>
              <p className="mt-4 text-sm md:text-base font-mono text-zinc-400 tracking-wide">
                From Idea to Product
              </p>
            </div>

            <div className="mt-4 md:mt-0 font-mono text-xs text-zinc-400 border border-white/10 px-4 py-2 bg-zinc-950">
              PIPELINE: 04 STAGES // STATUS: ACTIVE
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/15 bg-black/80 backdrop-blur-md">
            {WORKFLOW.map((step, i) => (
              <FloatingCard key={step.code} index={i} className="h-full">
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group relative min-h-[280px] md:min-h-[320px] p-7 md:p-10 border-b border-r border-white/15 bg-black cursor-default select-none overflow-hidden h-full"
                data-hover="true"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 4px)',
                  }}
                />

                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 border border-white/20 bg-zinc-950 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="text-4xl md:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-zinc-700/40 group-hover:from-white/70 group-hover:to-zinc-500/50 transition-all">
                      {step.code}
                    </span>
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        // STAGE_{step.code}
                      </span>
                    </div>

                    <motion.h3
                      className="font-heading text-2xl md:text-3xl font-bold uppercase text-white tracking-tight mb-4"
                      variants={{
                        rest: { y: 0 },
                        hover: { y: -3 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.code} — {step.title}
                    </motion.h3>

                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light mb-6">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>PIPELINE_NODE: 0x{step.code}</span>
                      <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">[ACTIVE]</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/40 transition-all duration-500" />
              </motion.div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* TECH STACK SECTION */}
      <SectionShell id="stack" className="relative z-10 py-20 md:py-32 bg-black/95 border-t border-white/15 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 px-4">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>// [MODULE_04] :: TECH_ARSENAL</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] text-white tracking-tight">
                Tech <br/>
                <GlitchText text="STACK" className="text-5xl md:text-8xl" />
              </h2>
              <p className="mt-4 text-sm md:text-base font-mono text-zinc-400 tracking-wide">
                Technologies I Work With
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08} y={24}>
          <div className="work-slider stack-slider relative border-y border-white/15 bg-black/80">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 z-10 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 z-10 bg-gradient-to-l from-black to-transparent" />

            <div className="work-slider-track stack-slider-track flex w-max">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 gap-4 pr-4 py-6 pl-4">
                  {TECH_STACK.map((tech, i) => (
                    <TechSliderCard
                      key={`${dup}-${tech}`}
                      tech={tech}
                      index={i}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionShell>

      {/* WHY WORK WITH ME SECTION */}
      <SectionShell id="why" className="relative z-10 py-20 md:py-32 border-t border-white/15 overflow-hidden">
        <div className="absolute top-1/2 left-[-10%] w-[45vw] h-[45vw] bg-white/5 rounded-full blur-[70px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative">
          <Reveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 px-4">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                <span>// [MODULE_05] :: VALUE_MATRIX</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] text-white tracking-tight">
                Why Work <br/>
                <GlitchText text="WITH ME" className="text-5xl md:text-8xl" />
              </h2>
              <p className="mt-4 text-sm md:text-base font-mono text-zinc-400 tracking-wide">
                More Than Just Development
              </p>
            </div>

            <div className="mt-4 md:mt-0 font-mono text-xs text-zinc-400 border border-white/10 px-4 py-2 bg-zinc-950">
              DIFFERENTIATORS: 04 // STATUS: PROVEN
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/15 bg-black/80 backdrop-blur-md">
            {WHY_ME.map((item, i) => (
              <FloatingCard key={item.code} index={i} className="h-full">
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group relative min-h-[280px] md:min-h-[320px] p-7 md:p-10 border-b border-r border-white/15 bg-black cursor-default select-none overflow-hidden h-full"
                data-hover="true"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 4px)',
                  }}
                />

                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 border border-white/20 bg-zinc-950 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 tracking-widest">[{item.code}]</span>
                      <span className="text-[10px] font-mono text-zinc-400 border border-white/15 px-2 py-0.5 bg-black">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        // ADVANTAGE_{item.code}
                      </span>
                    </div>

                    <motion.h3
                      className="font-heading text-2xl md:text-3xl font-bold uppercase text-white tracking-tight mb-4"
                      variants={{
                        rest: { y: 0 },
                        hover: { y: -3 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.title}
                    </motion.h3>

                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>SIGNAL: STRONG</span>
                      <span className="text-zinc-400 font-bold group-hover:text-white transition-colors">[VERIFIED]</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/40 transition-all duration-500" />
              </motion.div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* FOOTER */}
      <motion.footer
        id="contact"
        className="relative z-10 border-t border-white/15 bg-black text-zinc-400 font-mono text-xs overflow-x-clip"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative w-full pt-10 md:pt-20 pb-2 md:pb-4 select-none">
          <div className="lets-talk relative flex items-center justify-center gap-1.5 sm:gap-4 md:gap-6 px-3 sm:px-[2vw]">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="lets-talk-text font-heading font-black uppercase tracking-tight whitespace-nowrap bg-transparent border-none cursor-pointer p-0"
              data-hover="true"
              aria-label="Let's talk"
            >
              LET&apos;S
            </button>

            <div
              className="lets-talk-mascot relative z-20 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <HeroMascot size={96} className="footer-mascot" />
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="lets-talk-text font-heading font-black uppercase tracking-tight whitespace-nowrap bg-transparent border-none cursor-pointer p-0"
              data-hover="true"
              aria-label="Let's talk"
            >
              TALK
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-ai-terminal'))}
          className="relative z-20 block mx-auto px-4 pb-8 md:pb-10 text-center text-xs sm:text-sm md:text-base font-mono text-white tracking-wide whitespace-nowrap overflow-x-auto bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity underline underline-offset-4 decoration-white/40 hover:decoration-white"
          data-hover="true"
        >
          Too shy to email? Open AI_TERMINAL — it has my contacts.
        </button>

        <div className="max-w-7xl mx-auto px-6 pb-12 md:pb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs sm:text-sm font-mono text-zinc-300 tracking-wide">
              Have a project in mind?
            </span>
            <a
              href="mailto:hello@ahmedbadr.dev"
              className="text-sm sm:text-base font-mono font-bold text-white hover:text-zinc-300 transition-colors tracking-wider"
              data-hover="true"
            >
              hello@ahmedbadr.dev
            </a>
            <div className="flex flex-col gap-1 text-[11px] text-zinc-500 mt-2">
              <span>SYS_ARCH: CLIENT_RENDER // THEME: BLACK_TECH_GRID</span>
              <span>STATUS: OPEN_FOR_PROJECTS // READY_TO_BUILD</span>
            </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap items-center">
            <span className="text-zinc-600">// REPO: V2.5.0</span>
            <a 
              href="https://github.com/ahmedbadr-dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/20 p-2 bg-zinc-950 inline-flex items-center justify-center" 
              data-hover="true"
              aria-label="GitHub"
            >
              <Github size={18} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </motion.footer>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigate={handleNavigateProject}
      />
    </div>
    </MotionConfig>
  );
};

export default App;
