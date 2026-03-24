'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  as?: 'button' | 'a' | 'div'
  href?: string
  target?: string
  rel?: string
  onClick?: () => void
}

export function MagneticButton({
  children,
  className = '',
  as = 'div',
  href,
  target,
  rel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const Component = motion.div

  return (
    <Component
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      className={className}
      data-cursor="interactive"
      data-cursor-label="CLICK"
    >
      {as === 'a' && href ? (
        <a href={href} target={target} rel={rel} className="block w-full h-full">
          {children}
        </a>
      ) : as === 'button' ? (
        <button onClick={onClick} className="block w-full h-full">
          {children}
        </button>
      ) : (
        children
      )}
    </Component>
  )
}
