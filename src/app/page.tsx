'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, LazyMotion, domAnimation, m } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { Navbar } from '@/components/ui/Navbar'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { ParallaxCard } from '@/components/motion/ParallaxCard'
import { OscilloscopeCanvas } from '@/components/motion/OscilloscopeCanvas'
import { CircuitWipe } from '@/components/motion/CircuitWipe'
import { EASE_CINEMATIC, SPRING_SCROLL, throttle } from '@/lib/animations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ──────────────────────────────────────
   DATA
   ────────────────────────────────────── */
const rotatingWords = ['IoT', 'PCB Design', 'AI/ML', 'Embedded', 'BCI']
const services = ['Embedded Systems & PCB Design', 'IoT & Automation', 'AI & Machine Learning']

const education = {
  degree: 'B.E. — Electronics & Communication Engineering',
  college: 'KCG College of Technology, Chennai',
  duration: 'Sep 2024 – Present',
  status: 'Semester 3',
  cgpa: '8.34 / 10.00',
}

const experience = {
  role: 'Industrial Trainee — Data Networking',
  company: 'Bharat Sanchar Nigam Limited (BSNL), Chennai',
  duration: '1 Week · 2024',
  description: 'Completed structured training on routing protocols, switching architectures, and enterprise communication systems. Gained hands-on exposure to large-scale telecom infrastructure and industrial networking setups.',
}

const achievements = [
  { name: 'Young Technocrats 3.0', year: '2025', project: 'Led KCG-wide innovation summit as Coordinator', icon: '🎯' },
  { name: "Hackathonix '26", year: '2026', project: 'Built BookBridge (full-stack) in 48 hours', icon: '🏆' },
  { name: "SCIFEST '25 — Ideathon", year: '2025', project: 'KCG Innovation Council, National Science Day', icon: '🔬' },
  { name: 'IoT Boot Camp', year: '2025', project: 'Accident Rescue System — KCG ECE Centre of Excellence', icon: '🔧' },
]

const projects = [
  {
    name: 'Orbit AI — Mind-Controlled Assistive System',
    period: 'In Development',
    desc: 'Wearable non-invasive BCI device. EEG signals acquired via ADS1299, classified on-device using TinyML on ESP32/ARM Cortex-M, and delivered over BLE/Wi-Fi/ESP-NOW with <50 ms latency to control wheelchairs and smart home devices.',
    tags: ['ESP32', 'ADS1299', 'TensorFlow Lite', 'BLE', 'Wi-Fi', 'ESP-NOW'],
    color: '#1a0a2e',
    image: '/project-orbit-ai.png',
    github: 'https://github.com/NAVEENKCG/Mind_Wave_AImodel',
    flagship: true,
  },
  {
    name: 'Posture Detection & Thrombosis Prevention',
    period: 'Nov 2025 – Feb 2026',
    desc: 'Real-time posture monitoring system using multiple sensors and a microcontroller. Sensor data is classified on-device and alerts are pushed wirelessly to the user within <100 ms.',
    tags: ['Sensors', 'Microcontroller', 'Embedded C', 'Python'],
    color: '#1a0a2e',
    image: '/project-posture.png',
    github: 'https://github.com/NAVEENKCG/Photo_Pose_AI',
    flagship: false,
  },
  {
    name: 'RF Defence System — PCB Design & Embedded',
    period: 'Jan – Mar 2026',
    desc: 'Designed a full RF interference detector PCB from schematic to Gerber/DRL outputs using KiCad. Integrated LM358 Op-Amp with ESP32 to detect and directionally track anomalous wireless signals.',
    tags: ['KiCad', 'ESP32', 'LM358 Op-Amp', 'Embedded C'],
    color: '#0a1628',
    image: '/project-rf-defence.png',
    github: 'https://github.com/NAVEENKCG/RF_Defence_System_PCB',
    flagship: false,
  },
  {
    name: 'Servo Motor Tester PCB',
    period: 'May 2026',
    desc: 'Hardware PCB designed to test servo motors precisely without complex setups. Implements timer circuits and potentiometers for manual control testing.',
    tags: ['KiCad', 'PCB Design', 'Hardware', 'Analog'],
    color: '#0d1b2a',
    image: '/project-servo.png',
    github: 'https://github.com/NAVEENKCG/Servo_motor_tester_PCB',
    flagship: false,
  },
]

const webProjects = [
  { name: 'MindWave Web', desc: 'UI dashboard for BCI system data visualisation' },
  { name: 'BookBridge', desc: 'Full-stack book-sharing platform built in 48 hours at Hackathonix \'26' },
  { name: 'Portfolio Sites', desc: 'Personal and client portfolios with animated, responsive layouts' },
]

const certifications = [
  { name: 'FPGA Architecture', issuer: 'GUVI / HCL', icon: '🔲' },
  { name: 'IoT Boot Camp', issuer: 'KCG Centre of Excellence', icon: '📡' },
  { name: 'Data Networking', issuer: 'BSNL, Chennai', icon: '🌐' },
  { name: 'Arduino Programming', issuer: 'GUVI / HCL', icon: '⚡' },
]

const skillGroups = [
  {
    label: 'Core Skills',
    skills: ['Embedded C / C++', 'ESP32 & Arduino', 'IoT System Design', 'PCB Design', 'Embedded Automation', 'Sensor Integration', 'Python & AI/ML (TinyML)', 'UI / Web Design', 'FPGA Programming'],
  },
  {
    label: 'Microcontrollers',
    skills: ['ESP32', 'ARM Cortex-M', 'Arduino'],
  },
  {
    label: 'Hardware & Analog',
    skills: ['Op-Amps', 'Rectifier & Filter Design', 'RF Modules', 'FPGA'],
  },
  {
    label: 'PCB Design Tools',
    skills: ['KiCad', 'Altium'],
  },
  {
    label: 'Protocols & Wireless',
    skills: ['UART', 'BLE', 'Wi-Fi', 'ESP-NOW', 'SPI', 'I²C'],
  },
  {
    label: 'AI / Vision',
    skills: ['YOLOv5', 'OpenCV', 'TensorFlow Lite', 'PyTorch', 'NumPy', 'Scikit-learn'],
  },
  {
    label: 'Languages',
    skills: ['Embedded C', 'C++', 'Python'],
  },
  {
    label: 'UI / Web Design',
    skills: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  },
]

/* ──────────────────────────────────────
   MAIN PAGE COMPONENT
   ────────────────────────────────────── */
export default function HomePage() {
  const prefersReducedMotion = useReducedMotion()
  const [currentWord, setCurrentWord] = useState(0)
  const [greeting, setGreeting] = useState('Good morning,')
  const heroRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  /* ── Scoped scroll for hero parallax ── */
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  // Hero image: scale down + fade out as content floor rises
  // Using raw useTransform (no useSpring) to avoid continuous RAF ticks that cause scroll jank
  const heroScale = useTransform(heroScrollProgress, [0, 0.3, 0.7, 1], [1, 0.98, 0.95, 0.9])
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5, 1], [1, 0.5, 0])

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning,')
    else if (hour < 18) setGreeting('Good afternoon,')
    else setGreeting('Good evening,')
  }, [])

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // GSAP scroll animations (stat counters)
  useEffect(() => {
    if (statsRef.current) {
      const statEls = statsRef.current.querySelectorAll('[data-count]')
      statEls.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count') || '0')
        const suffix = el.textContent?.includes('+') ? '+' : ''
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                (el as HTMLElement).textContent = Math.floor(this.targets()[0].val) + suffix
              },
            })
          },
        })
      })
    }
  }, [])

  return (
    <>
      <Navbar />

      {/* ════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════ */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Oscilloscope waveform background — lightweight canvas, no Three.js */}
        <OscilloscopeCanvas />

        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(255,77,0,0.06),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Fixed Hero Image Layer — uses scoped scroll transforms for parallax */}
        <motion.div
          id="hero-bg"
          className="fixed inset-0 z-0 pointer-events-none parallax-layer"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <Image
            src="/hero-new.png"
            alt="Naveenraj S.S — Electronics & Communication Engineer"
            fill
            className="object-cover object-[center_top] lg:object-[60%_top] brightness-125"
            priority
            quality={95}
            sizes="100vw"
          />
          {/* Gradient overlays — only on left side for text readability, right side stays bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-base/90 from-5% via-base/30 via-35% to-transparent to-60%" />
          <div className="absolute inset-0 bg-gradient-to-t from-base/60 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-2 md:px-4 min-h-screen flex flex-col justify-between py-24 md:py-28">
          {/* Top row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.6 }}
            className="flex justify-between items-start min-h-[20px]"
          >
            {/* Empty space to maintain justify-between layout */}
          </motion.div>

          {/* Center — name and headline */}
          <div className="flex-1 flex flex-col justify-center pt-16 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, ...EASE_CINEMATIC }}
              className="mb-4"
            >
              <span className="text-xs text-text-primary/40 font-mono">{greeting} Hi there! this is</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span
                  className="text-sm md:text-base font-bold text-text-primary drop-shadow-md"
                  style={{ color: '#ffffff', fontFamily: 'var(--font-clash-display)' }}
                >
                  Naveenraj
                </span>
                <span
                  className="text-sm md:text-base font-bold text-text-primary drop-shadow-md"
                  style={{ color: '#f0ece4', fontFamily: 'var(--font-clash-display)' }}
                >
                  S.S
                </span>
              </div>
            </motion.div>

            {/* MASSIVE headline */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <h1
                className="text-[clamp(2.5rem,7vw,7rem)] md:text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] uppercase"
                style={{ fontFamily: 'var(--font-clash-display)', fontVariationSettings: '"wght" 800' }}
              >
                <span className="block text-text-primary">ENGINEER</span>
                <span className="block text-text-primary">THE FUTURE</span>
              </h1>
              {/* Rotating word */}
              <div className="slide-text-wrap mt-2 overflow-hidden h-[clamp(2.5rem,7vw,7rem)] md:h-[clamp(3.5rem,8vw,8rem)]" style={{ fontFamily: 'var(--font-clash-display)' }}>
                <motion.span
                  key={currentWord}
                  initial={{ y: '100%', rotateX: -90 }}
                  animate={{ y: '0%', rotateX: 0 }}
                  exit={{ y: '-100%', rotateX: 90 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="slide-text-item block text-[clamp(2.5rem,7vw,7rem)] md:text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] text-accent uppercase"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  {rotatingWords[currentWord]}
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 0.5 }}
              className="mt-8 text-xs text-text-primary/30 font-mono"
            >
              (Scroll down)
            </motion.div>
          </div>

          {/* Bottom row — services + bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, ...EASE_CINEMATIC }}
            className="flex flex-col md:flex-row justify-between items-end gap-8"
          >
            {/* Services list */}
            <div className="hidden md:block">
              <div className="space-y-1 text-sm text-text-primary/50 mb-4">
                {services.map((s) => (
                  <div key={s}>{s}</div>
                ))}
              </div>
              <MagneticButton as="a" href="mailto:rajn51174@gmail.com">
                <span className="text-xs text-text-primary/60 underline underline-offset-4 decoration-text-primary/20 hover:text-text-primary hover:decoration-accent transition-colors duration-300 flex items-center gap-2">
                  How can I help? <span className="text-accent">↗</span>
                </span>
              </MagneticButton>
            </div>

            {/* Bio text */}
            <div className="max-w-xs text-right mr-0 md:-mr-4">
              <p className="text-xs md:text-sm text-text-primary/50 leading-relaxed">
                Electronics &amp; Communication Engineer · Embedded Systems &amp; PCB Designer. Passionate about R&amp;D in embedded systems, IoT, and AI-based solutions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          RISING FLOOR (Layer B) - Slides over fixed hero
          ════════════════════════════════════ */}
      <div id="content-floor" className="relative z-10 bg-base w-full shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">

        {/* ════════════════════════════════════
            INTRO / ABOUT SECTION
            ════════════════════════════════════ */}
        <section id="about" className="scroll-container relative py-24 md:py-40 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left — Affiliations */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={EASE_CINEMATIC}
              >
                <h3 className="text-sm text-text-primary/40 mb-8">
                  Affiliations &amp; Experience
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {['KCG College', 'BSNL', 'GUVI/HCL', 'Young Tech', 'SCIFEST', 'Hackathonix'].map((logo, i) => (
                    <div
                      key={logo}
                      className="glass-card aspect-[4/3] flex items-center justify-center p-6 rounded-2xl hover:bg-white/[0.07] hover:border-white/[0.18] transition-colors duration-300 relative overflow-hidden group"
                    >
                      <div
                        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ background: `linear-gradient(${135 + i * 45}deg, var(--accent) 0%, transparent 100%)` }}
                      />
                      <span className="text-sm text-text-primary/90 text-center font-bold tracking-widest relative z-10">{logo}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right — About text with word reveal */}
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-xs text-accent/70 mb-4 block"
                >
                  (About)
                </motion.span>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.02 } },
                    hidden: {},
                  }}
                  className="mb-12"
                >
                  <p className="text-xl md:text-[2.2rem] leading-[1.35] tracking-[-0.02em] text-text-primary/90 mb-8" style={{ fontFamily: 'var(--font-clash-display)', fontWeight: 300 }}>
                    {`I'm Naveenraj S.S, a 3rd-year Electronics & Communication Engineering student at KCG College of Technology, Chennai, passionate about building systems that bridge the gap between hardware and intelligence.`.split(' ').map((word, i) => (
                      <span key={`w1-${i}`} className="inline-block mr-[0.3em] overflow-hidden">
                        <motion.span
                          variants={{
                            hidden: { y: '100%' },
                            visible: { y: '0%', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                          }}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </p>
                  <p className="text-xl md:text-[2.2rem] leading-[1.35] tracking-[-0.02em] text-text-primary/70 mb-8" style={{ fontFamily: 'var(--font-clash-display)', fontWeight: 300 }}>
                    {`I design embedded systems end-to-end — from PCB schematics to firmware to on-device AI inference. Whether it's a brain-computer interface, an RF detection system, or a real-time IoT dashboard, I build the full stack: hardware, firmware, and the software layer on top.`.split(' ').map((word, i) => (
                      <span key={`w2-${i}`} className="inline-block mr-[0.3em] overflow-hidden">
                        <motion.span
                          variants={{
                            hidden: { y: '100%' },
                            visible: { y: '0%', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                          }}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </p>
                  <p className="text-xl md:text-[2.2rem] leading-[1.35] tracking-[-0.02em] text-text-primary/50" style={{ fontFamily: 'var(--font-clash-display)', fontWeight: 300 }}>
                    {`Currently open to short-term internships in embedded R&D, PCB design, and product engineering.`.split(' ').map((word, i) => (
                      <span key={`w3-${i}`} className="inline-block mr-[0.3em] overflow-hidden">
                        <motion.span
                          variants={{
                            hidden: { y: '100%' },
                            visible: { y: '0%', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                          }}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </p>
                </motion.div>

                {/* Arrow link */}
                <MagneticButton>
                  <a
                    href="mailto:rajn51174@gmail.com"
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:border-accent transition-colors duration-300"
                    data-cursor="interactive"
                    data-cursor-label="GO"
                  >
                    <span className="text-accent text-xl">↗</span>
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* Circuit trace divider */}
        <CircuitWipe className="mb-4" />

        {/* ════════════════════════════════════
            EDUCATION & EXPERIENCE SECTION
            ════════════════════════════════════ */}
        <section id="education" className="scroll-container py-24 md:py-32 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={EASE_CINEMATIC}
              className="mb-16"
            >
              <span className="text-xs text-accent/70 uppercase tracking-widest block mb-4">Education & Experience</span>
              <h2
                className="text-4xl md:text-6xl font-light tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                Academic Background
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Education Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={EASE_CINEMATIC}
              >
                <div className="glass-card rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎓</span>
                    <span className="text-xs text-accent/70 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Education</span>
                  </div>
                  <div className="timeline-card">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-clash-display)' }}>
                      {education.degree}
                    </h3>
                    <p className="text-sm text-text-primary/60 mb-1">{education.college}</p>
                    <p className="text-xs text-text-primary/40 mb-4 font-mono">{education.duration} · {education.status}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-light text-accent" style={{ fontFamily: 'var(--font-clash-display)' }}>
                        {education.cgpa.split('/')[0].trim()}
                      </span>
                      <span className="text-sm text-text-primary/30">/ {education.cgpa.split('/')[1].trim()}</span>
                    </div>
                    <span className="text-[10px] text-text-primary/30 uppercase tracking-wider">CGPA</span>
                  </div>
                </div>
              </motion.div>

              {/* Experience Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ ...EASE_CINEMATIC, delay: 0.1 }}
              >
                <div className="glass-card rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">💼</span>
                    <span className="text-xs text-accent/70 uppercase tracking-widest font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Experience</span>
                  </div>
                  <div className="timeline-card">
                    <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-clash-display)' }}>
                      {experience.role}
                    </h3>
                    <p className="text-sm text-text-primary/60 mb-1">{experience.company}</p>
                    <p className="text-xs text-text-primary/40 mb-4 font-mono">{experience.duration}</p>
                    <p className="text-sm text-text-primary/50 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Circuit trace divider */}
        <CircuitWipe className="my-4" />

        {/* ════════════════════════════════════
          ACHIEVEMENTS + MARQUEE
          ════════════════════════════════════ */}
        <section className="scroll-container py-16 border-y border-white/[0.06] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-16">
            <h3 className="text-sm font-bold mb-8" style={{ fontFamily: 'var(--font-syne)' }}>
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((award) => (
                <ParallaxCard
                  key={award.name}
                  className="glass-card p-6 rounded-2xl group"
                  tiltIntensity={10}
                  parallaxRange={30}
                >
                  <div className="text-lg mb-2">{award.icon}</div>
                  <div className="text-text-primary/20 text-xs font-mono mb-1">{award.year}</div>
                  <div className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>
                    {award.name}
                  </div>
                  <div className="text-xs text-text-primary/40">{award.project}</div>
                </ParallaxCard>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div ref={statsRef} className="max-w-[1400px] mx-auto px-6 md:px-10 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: 2, suffix: '+', label: 'years of experience' },
                { num: 10, suffix: '+', label: 'projects completed' },
                { num: 4, suffix: '', label: 'hackathons & events' },
                { num: 4, suffix: '', label: 'certifications earned' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={EASE_CINEMATIC}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-light tracking-[-0.03em] mb-2" style={{ fontFamily: 'var(--font-clash-display)' }}>
                    <span data-count={stat.num}>0{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-text-primary/30 uppercase tracking-wider" style={{ fontFamily: 'var(--font-syne)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Marquee — uses LazyMotion for lighter tree-shaking */}
          <LazyMotion features={domAnimation} strict>
            <div className="pause-on-hover mt-8 overflow-hidden flex bg-surface/30 border-y border-white/[0.03] py-6 whitespace-nowrap relative">
              <div className="flex shrink-0 animate-marquee-left will-change-transform">
                {[...Array(6)].map((_, i) => (
                  <span key={`a-${i}`} className="flex items-center gap-8 pr-8 text-[clamp(2.5rem,6vw,4rem)] font-bold uppercase text-text-primary/80 whitespace-nowrap" style={{ fontFamily: 'var(--font-clash-display)' }}>
                    <span>Embedded Systems</span>
                    <span className="text-accent/80">✦</span>
                    <span>PCB Design</span>
                    <span className="text-accent/80">✦</span>
                    <span>IoT &amp; Automation</span>
                    <span className="text-accent/80">✦</span>
                    <span>AI / ML</span>
                    <span className="text-accent/80">✦</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 animate-marquee-left will-change-transform">
                {[...Array(6)].map((_, i) => (
                  <span key={`b-${i}`} className="flex items-center gap-8 pr-8 text-[clamp(2.5rem,6vw,4rem)] font-bold uppercase text-text-primary/80 whitespace-nowrap" style={{ fontFamily: 'var(--font-clash-display)' }}>
                    <span>Embedded Systems</span>
                    <span className="text-accent/80">✦</span>
                    <span>PCB Design</span>
                    <span className="text-accent/80">✦</span>
                    <span>IoT &amp; Automation</span>
                    <span className="text-accent/80">✦</span>
                    <span>AI / ML</span>
                    <span className="text-accent/80">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </LazyMotion>
        </section>

        {/* Circuit trace divider */}
        <CircuitWipe className="my-4" />

        {/* ════════════════════════════════════
          PROJECTS SECTION
          ════════════════════════════════════ */}
        <section id="projects" className="scroll-container py-24 md:py-40 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24"
            >
              <p className="text-sm text-accent uppercase tracking-wider mb-4 font-mono font-bold">Projects I</p>
              <h2
                className="text-[clamp(3rem,12vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.04em] uppercase text-text-primary"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                WORKED ON<br />
                <span className="text-text-primary/70">24-26</span>
                <sup className="text-accent text-3xl ml-2">®</sup>
              </h2>
            </motion.div>

            {/* Project cards */}
            <div className="space-y-32">
              {projects.map((project, i) => (
                <ParallaxCard
                  key={project.name}
                  as="a"
                  href={project.github}
                  target="_blank"
                  className={`grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start hover:opacity-95 transition-opacity ${project.flagship ? 'flagship-card rounded-3xl p-6 md:p-8' : ''}`}
                  tiltIntensity={8}
                  parallaxRange={40}
                  glowColor={`${project.color}80`}
                >
                  {/* Project image area */}
                  <div
                    className="relative aspect-video lg:aspect-[21/9] lg:h-[320px] rounded-2xl overflow-hidden group bg-surface transform-gpu"
                    data-cursor="interactive"
                    data-cursor-label="VIEW"
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading={i === 0 ? undefined : 'lazy'}
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Flagship badge */}
                    {project.flagship && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="featured-badge text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                          ✦ In Development
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-8 left-8 right-8">
                      <h3
                        className="text-2xl md:text-3xl font-bold text-text-primary mb-3"
                        style={{ fontFamily: 'var(--font-clash-display)' }}
                      >
                        {project.name}
                      </h3>
                      <p className="text-sm text-text-primary/50 max-w-md">{project.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-3 py-1 border border-white/10 rounded-full text-text-primary/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project metadata */}
                  <div className="lg:w-64 space-y-6">
                    <div>
                      <span className="text-xs text-text-primary/30 uppercase tracking-wider block mb-1">Period</span>
                      <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-clash-display)' }}>
                        {project.period}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-text-primary/30 uppercase tracking-wider block mb-1">Description</span>
                      <span className="text-sm text-text-primary/50 leading-relaxed">{project.desc}</span>
                    </div>
                    <div>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors duration-300 underline underline-offset-4 decoration-accent/30"
                        data-cursor="interactive"
                        data-cursor-label="GITHUB"
                      >
                        View on GitHub <span>↗</span>
                      </a>
                    </div>
                  </div>
                </ParallaxCard>
              ))}
            </div>

            {/* Web Design Projects Sub-section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={EASE_CINEMATIC}
              className="mt-32"
            >
              <span className="text-xs text-accent/70 uppercase tracking-widest block mb-6">Web Design Projects</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {webProjects.map((wp, i) => (
                  <motion.div
                    key={wp.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...EASE_CINEMATIC, delay: i * 0.08 }}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.96 }}
                    className={`glass-card rounded-2xl p-6 ${i === 0 ? 'md:col-span-2' : ''}`}
                  >
                    <h4 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                      {wp.name}
                    </h4>
                    <p className="text-xs text-text-primary/40 leading-relaxed">{wp.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href="https://github.com/NAVEENKCG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors duration-300 underline underline-offset-4 decoration-accent/30"
                  data-cursor="interactive"
                  data-cursor-label="GITHUB"
                >
                  View all on GitHub <span>↗</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════
          CERTIFICATIONS SECTION
          ════════════════════════════════════ */}
        <section id="certifications" className="scroll-container py-24 md:py-40 px-6 md:px-10 bg-surface">
          <div className="max-w-[1400px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={EASE_CINEMATIC}
              className="text-xs text-text-primary/20 uppercase tracking-wider mb-16 font-mono"
            >
              Certifications &amp; Training
            </motion.h2>

            <div className="space-y-0">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ ...EASE_CINEMATIC, delay: i * 0.1 }}
                  className="border-t border-white/[0.06] py-10 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 group"
                  data-cursor="interactive"
                  data-cursor-label="CERT"
                >
                  <span className="text-5xl font-light text-text-primary/10" style={{ fontFamily: 'var(--font-clash-display)' }}>
                    0{i + 1}.
                  </span>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{cert.icon}</span>
                      <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
                        {cert.name}
                      </h4>
                    </div>
                    <p className="text-sm text-text-primary/40 group-hover:text-text-primary/60 transition-colors duration-500">
                      Issued by {cert.issuer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Circuit trace divider */}
        <CircuitWipe className="my-4" />

        {/* ════════════════════════════════════
          SKILLS SECTION — Categorized Groups
          ════════════════════════════════════ */}
        <LazyMotion features={domAnimation} strict>
          <section id="skills" className="scroll-container py-24 md:py-32 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto">
              <m.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={EASE_CINEMATIC}
                className="mb-16"
              >
                <h3 className="text-xs text-text-primary/20 uppercase tracking-wider mb-4 font-mono">
                  Skills &amp; Technologies
                </h3>
                <h2
                  className="text-4xl md:text-6xl font-light tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  Technical Arsenal
                </h2>
              </m.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillGroups.map((group, gi) => (
                  <m.div
                    key={group.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...EASE_CINEMATIC, delay: gi * 0.06 }}
                    className={`skill-group ${gi === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <h4 className="text-xs text-accent/70 uppercase tracking-widest mb-4 font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
                      {group.label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, si) => (
                        <m.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: si * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ scale: 1.08, backgroundColor: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' }}
                          whileTap={{ scale: 0.96 }}
                          className="text-xs px-4 py-2 glass-card rounded-full text-text-primary/50 cursor-none"
                          style={{ fontFamily: 'var(--font-syne)' }}
                          data-cursor="interactive"
                          data-cursor-label="SKILL"
                        >
                          {skill}
                        </m.span>
                      ))}
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </section>
        </LazyMotion>

        {/* ════════════════════════════════════
          CONTACT / FOOTER
          ════════════════════════════════════ */}
        <footer id="contact" className="scroll-container relative py-24 md:py-40 px-6 md:px-10 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,0,0.08),transparent_60%)] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto relative z-10">
            {/* Two column footer layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
              <div>
                <h3 className="text-xs text-text-primary/30 uppercase tracking-wider mb-3 font-mono">Socials</h3>
                <div className="space-y-2">
                  <a href="https://www.linkedin.com/in/naveenraj-s-s-b94669327/" target="_blank" rel="noopener noreferrer" className="block text-sm text-text-primary/60 hover:text-text-primary transition-colors duration-300" data-cursor="interactive" data-cursor-label="OPEN">LinkedIn</a>
                  <a href="https://github.com/NAVEENKCG" target="_blank" rel="noopener noreferrer" className="block text-sm text-text-primary/60 hover:text-text-primary transition-colors duration-300" data-cursor="interactive" data-cursor-label="OPEN">GitHub</a>
                </div>
              </div>
              <div>
                <h3 className="text-xs text-text-primary/30 uppercase tracking-wider mb-3 font-mono">Contact me</h3>
                <div className="space-y-2">
                  <a href="mailto:rajn51174@gmail.com" className="block text-sm text-text-primary/60 hover:text-text-primary transition-colors duration-300" data-cursor="interactive" data-cursor-label="OPEN">rajn51174@gmail.com</a>
                  <a href="tel:+918248935147" className="block text-sm text-text-primary/60 hover:text-text-primary transition-colors duration-300" data-cursor="interactive" data-cursor-label="OPEN">+91 82489 35147</a>
                </div>
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
              className="text-center mb-16"
            >
              <div className="overflow-hidden mb-4">
                <motion.p
                  variants={{
                    hidden: { y: 100 },
                    visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-sm text-text-primary/30"
                >
                  Looking for an internship opportunity?
                </motion.p>
              </div>

              <div className="overflow-hidden mb-12">
                <motion.h2
                  variants={{
                    hidden: { y: 150 },
                    visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-3xl md:text-5xl font-light tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  Let&apos;s build something incredible together
                </motion.h2>
              </div>

              <div className="overflow-hidden max-w-2xl mx-auto mb-12">
                <motion.p
                  variants={{
                    hidden: { y: 100 },
                    visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-sm md:text-base text-text-primary/40 leading-relaxed"
                  style={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  As an ECE engineer and embedded systems enthusiast, I believe in pushing boundaries. Engineering is about solving real-world problems — dedicating yourself to finding the right balance between hardware constraints and innovative solutions.
                </motion.p>
              </div>
            </motion.div>

            {/* Email marquee */}
            <div className="overflow-hidden mb-16 pause-on-hover flex border-y border-white/[0.03] py-4 bg-surface/20 whitespace-nowrap relative" data-cursor="interactive" data-cursor-label="SAY HI">
              <div className="flex shrink-0 animate-marquee-left will-change-transform">
                {[...Array(4)].map((_, i) => (
                  <span key={`a-${i}`} className="flex items-center gap-12 pr-12">
                    <a
                      href="mailto:rajn51174@gmail.com"
                      className="text-[clamp(2.5rem,8vw,6rem)] font-light tracking-[-0.03em] text-text-primary hover:text-accent transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-clash-display)' }}
                    >
                      rajn51174@gmail.com
                    </a>
                    <span className="text-accent/50 text-2xl md:text-4xl">✦</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 animate-marquee-left will-change-transform">
                {[...Array(4)].map((_, i) => (
                  <span key={`b-${i}`} className="flex items-center gap-12 pr-12">
                    <a
                      href="mailto:rajn51174@gmail.com"
                      className="text-[clamp(2.5rem,8vw,6rem)] font-light tracking-[-0.03em] text-text-primary hover:text-accent transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-clash-display)' }}
                    >
                      rajn51174@gmail.com
                    </a>
                    <span className="text-accent/50 text-2xl md:text-4xl">✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {services.map((s) => (
                <span key={s} className="text-xs text-text-primary/30 px-4 py-2 border border-white/[0.06] rounded-full">
                  {s}
                </span>
              ))}
            </div>

            <MagneticButton as="a" href="mailto:rajn51174@gmail.com" className="mx-auto block w-fit">
              <span className="text-xs text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors duration-300 flex items-center gap-2">
                How can I help? <span>↗</span>
              </span>
            </MagneticButton>

            {/* Copyright */}
            <div className="mt-20 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs text-text-primary/20 font-mono">
                © 2026 Naveenraj S.S. — All rights reserved
              </span>
              <div className="flex items-center gap-4">
                <a href="https://github.com/NAVEENKCG" target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary/20 hover:text-text-primary/40 transition-colors duration-300">GitHub</a>
                <span className="text-text-primary/10">·</span>
                <a href="https://www.linkedin.com/in/naveenraj-s-s-b94669327/" target="_blank" rel="noopener noreferrer" className="text-xs text-text-primary/20 hover:text-text-primary/40 transition-colors duration-300">LinkedIn</a>
                <span className="text-text-primary/10">·</span>
                <a href="mailto:rajn51174@gmail.com" className="text-xs text-text-primary/20 hover:text-text-primary/40 transition-colors duration-300">Email</a>
              </div>
              <span className="text-xs text-text-primary/20">
                ECE Engineer · Thiruchendur, Tamil Nadu
              </span>
            </div>
          </div>
        </footer>
      </div> {/* End Rising Floor */}
    </>
  )
}
