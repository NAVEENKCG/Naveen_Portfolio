'use client'

import { useRef, ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionTemplate,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE_CINEMATIC, throttle } from '@/lib/animations'

interface ParallaxCardProps {
  children: ReactNode
  className?: string
  tiltIntensity?: number
  parallaxRange?: number 
  glowColor?: string
  as?: 'div' | 'article' | 'a'
  href?: string
  target?: string
  rel?: string
}

export function ParallaxCard({
  children,
  className,
  tiltIntensity = 15,
  glowColor = 'rgba(255,77,0,0.08)',
  as = 'div',
  href,
  target,
  rel,
}: ParallaxCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  // ── Mouse 3D tilt (no scroll dependency) ──
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  // For the exact pixel glow overlay tracking
  const pixelMouseX = useMotionValue(200)
  const pixelMouseY = useMotionValue(200)

  const rotateX = useTransform(mouseY, [0, 1], [tiltIntensity, -tiltIntensity])
  const rotateY = useTransform(mouseX, [0, 1], [-tiltIntensity, tiltIntensity])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const glowTemplate = useMotionTemplate`radial-gradient(400px circle at ${pixelMouseX}px ${pixelMouseY}px, ${glowColor}, transparent 70%)`

  const handleMouseMove = throttle((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalized 0 to 1
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
    
    // Exact pixels
    pixelMouseX.set(e.clientX - rect.left)
    pixelMouseY.set(e.clientY - rect.top)
  }, 16)

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  const MotionTag = as === 'article' ? motion.article : as === 'a' ? motion.a : motion.div
  const linkProps = as === 'a' ? { href, target, rel } : {}

  // Reduced motion: opacity fade only, no transforms
  if (prefersReducedMotion) {
    return (
      <MotionTag
        ref={cardRef as any}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={EASE_CINEMATIC}
        className={cn('relative', className)}
        data-cursor="interactive"
        data-cursor-label="VIEW"
        {...linkProps}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      ref={cardRef as any}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
      }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative', className)}
      data-cursor="interactive"
      data-cursor-label="VIEW"
      {...linkProps}
    >
      {/* Mouse-tracking glow overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowTemplate }}
      />
      <div className="relative z-10">{children}</div>
    </MotionTag>
  )
}

export { ParallaxCard as default }

