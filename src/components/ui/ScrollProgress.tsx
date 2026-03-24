'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      transformOrigin: 'left center',
      scrollTrigger: {
        scrub: 0.3,
        start: 'top top',
        end: 'bottom bottom',
      },
    })
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[2px] w-full bg-accent z-[100] origin-left scale-x-0"
    />
  )
}
