// Animation constants — centralized easing and spring values
export const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 300, damping: 30 }
export const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 500, damping: 35 }
export const EASE_OUT_EXPO = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
export const EASE_CINEMATIC = { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }

export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: EASE_CINEMATIC,
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
}

export const scaleOnTap = { scale: 0.96 }
