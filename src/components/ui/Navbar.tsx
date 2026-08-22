'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  { label: 'li', href: 'https://www.linkedin.com/in/naveenraj-s-s-b94669327/' },
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
            ? 'bg-black/80 border-b border-white/10 shadow-lg'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-white/[0.04]'
        )}
      >
        {/* Left: Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="text-sm sm:text-base font-bold text-text-primary drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-wide"
            style={{ color: '#ffffff', fontFamily: 'var(--font-clash-display)' }}
          >
            Naveenraj
          </span>
          <span
            className="text-sm sm:text-base font-bold text-text-primary drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-wide"
            style={{ color: '#f0ece4', fontFamily: 'var(--font-clash-display)' }}
          >
            S.S
          </span>
        </div>

        {/* Center: Socials */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-text-primary tracking-wide">
          <span className="text-text-primary font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Socials</span>
          <span className="text-accent font-normal">/</span>
          {socials.map((s, idx) => (
            <span key={s.label} className="flex items-center gap-2 sm:gap-3">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-accent font-bold uppercase transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                data-cursor="interactive"
                data-cursor-label="OPEN"
              >
                {s.label}
              </a>
              {idx < socials.length - 1 && (
                <span className="text-accent/60 font-light">/</span>
              )}
            </span>
          ))}
        </div>

        {/* Right: Nav links + CTA */}
        <div className="hidden md:flex items-center gap-5 sm:gap-6">
          {navLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-5 sm:gap-6">
              <button
                onClick={() => scrollTo(link.href)}
                className="text-xs sm:text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-300 relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                data-cursor="interactive"
                data-cursor-label="GO"
              >
                {link.label}
              </button>
              {i < navLinks.length - 1 && (
                <span className="text-accent/60 font-light text-xs sm:text-sm">/</span>
              )}
            </span>
          ))}
          <span className="text-accent/60 font-light text-xs sm:text-sm">/</span>
          <a
            href="/Naveenraj_Resume_portfolio.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            data-cursor="interactive"
            data-cursor-label="VIEW"
          >
            Resume
          </a>
          <span className="text-accent/60 font-light text-xs sm:text-sm">/</span>
          <MagneticButton
            as="a"
            href="mailto:rajn51174@gmail.com"
            className="inline-block"
          >
            <span className="text-xs sm:text-sm font-bold text-accent hover:text-accent/80 transition-colors duration-300 underline underline-offset-4 decoration-accent">
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
              href="/Naveenraj_Resume_portfolio.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: navLinks.length * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-4 py-4 border-b border-white/[0.06] text-left"
              style={{ fontFamily: 'var(--font-clash-display)' }}
            >
              <span className="font-mono text-xs text-accent">0{navLinks.length + 1}</span>
              <span className="text-4xl md:text-5xl font-light text-text-primary">
                Resume
              </span>
            </motion.a>
            <motion.a
              href="mailto:rajn51174@gmail.com"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navLinks.length + 1) * 0.1, duration: 0.5 }}
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
