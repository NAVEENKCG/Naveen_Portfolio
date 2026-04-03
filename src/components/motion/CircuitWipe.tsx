'use client'

import { motion } from 'framer-motion'

/* ────────────────────────────────────────────
   CircuitWipe — SVG circuit-trace path animation
   for section transitions.
   
   Uses pathLength 0→1 animation for the "drawing" effect.
   Clips content behind it as it animates.
   
   PERF: Only animates SVG pathLength + opacity.
   No layout-triggering properties.
   ──────────────────────────────────────────── */
interface CircuitWipeProps {
  className?: string
}

export function CircuitWipe({ className = '' }: CircuitWipeProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-20"
        preserveAspectRatio="none"
      >
        {/* Main circuit trace */}
        <motion.path
          d="M0 40 L200 40 L220 20 L400 20 L420 40 L600 40 L620 60 L800 60 L820 40 L1000 40 L1020 20 L1200 20"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Secondary trace (dimmer) */}
        <motion.path
          d="M0 60 L150 60 L170 40 L350 40 L370 60 L550 60 L570 40 L750 40 L770 60 L950 60 L970 40 L1200 40"
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        {/* Circuit nodes (dots at junctions) */}
        {[220, 420, 620, 820, 1020].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={i % 2 === 0 ? 20 : 60}
            r="3"
            fill="var(--accent)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    </div>
  )
}

export { CircuitWipe as default }
