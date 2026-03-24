'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Index', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
]

const socials = [
  { label: 'li', href: 'https://linkedin.com/in/naveenraj-s-s-b94669' },
  { label: 'gh', href: 'https://github.com/NAVEENKCG' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-6 md:px-10 transition-all duration-300',
          'backdrop-blur-2xl',
          scrolled
            ? 'bg-black/40 border-b border-white/[0.06]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        {/* Left: Name */}
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-bold text-text-primary"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            Naveenraj
          </span>
          <span
            className="text-sm font-bold text-text-primary/50"
            style={{ fontFamily: 'var(--font-clash-display)' }}
          >
            SS
          </span>
        </div>

        {/* Center: Socials */}
        <div className="hidden md:flex items-center gap-2 text-xs text-text-primary/40">
          <span className="text-text-primary/60">Socials</span>
          <span>/</span>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors duration-300"
              data-cursor="interactive"
              data-cursor-label="OPEN"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Right: Nav links + CTA */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-6">
              <button
                onClick={() => scrollTo(link.href)}
                className={cn(
                  'text-xs text-text-primary/60 hover:text-text-primary transition-colors duration-300 relative',
                  i === 0 && 'text-text-primary'
                )}
                data-cursor="interactive"
                data-cursor-label="GO"
              >
                {link.label}
              </button>
              {i < navLinks.length - 1 && (
                <span className="text-text-primary/20 text-xs">/</span>
              )}
            </span>
          ))}
          <MagneticButton
            as="a"
            href="mailto:rajn51174@gmail.com"
            className="inline-block"
          >
            <span className="text-xs font-bold text-accent hover:text-accent/80 transition-colors duration-300 underline underline-offset-4 decoration-accent/30">
              Let&apos;s talk!
            </span>
          </MagneticButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] w-7 z-50 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-cursor="interactive"
        >
          <motion.span
            className="block w-full h-[1.5px] bg-text-primary origin-center"
            animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-full h-[1.5px] bg-text-primary"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-full h-[1.5px] bg-text-primary origin-center"
            animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-45 bg-base flex flex-col justify-center px-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => scrollTo(link.href)}
                className="flex items-baseline gap-4 py-4 border-b border-white/[0.06] text-left"
                style={{ fontFamily: 'var(--font-clash-display)' }}
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <span className="text-4xl md:text-5xl font-light text-text-primary">
                  {link.label}
                </span>
              </motion.button>
            ))}
            <motion.a
              href="mailto:rajn51174@gmail.com"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 text-accent text-xl font-bold underline"
            >
              Let&apos;s talk!
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
