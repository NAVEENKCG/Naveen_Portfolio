'use client'

import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 h-[2px] w-full bg-accent z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
