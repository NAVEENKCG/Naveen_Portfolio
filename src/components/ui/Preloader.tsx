'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLSpanElement>(null)
  const lastRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const counter = counterRef.current
    const name = nameRef.current
    const first = firstRef.current
    const last = lastRef.current
    if (!container || !counter || !name || !first || !last) return

    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true)
        document.body.style.overflow = ''
      },
    })

    // Phase 1: Count 0→100
    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: function () {
          counter.textContent = String(Math.floor(this.targets()[0].val)).padStart(2, '0')
        },
      }
    )
      // Phase 2: Fade counter, show name
      .to(counter, { opacity: 0, duration: 0.3 })
      .fromTo(name, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
      // Phase 3: Split name
      .to(first, { y: '-110%', duration: 0.6, ease: 'power3.inOut' }, '+=0.4')
      .to(last, { y: '110%', duration: 0.6, ease: 'power3.inOut' }, '<')
      // Phase 4: Remove preloader
      .to(container, { opacity: 0, duration: 0.3 })
      .set(container, { display: 'none' })
  }, [])

  if (isLoaded) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] bg-base flex items-center justify-center flex-col"
    >
      <span
        ref={counterRef}
        className="font-mono text-[clamp(3rem,8vw,6rem)] text-text-primary font-normal tracking-[-0.03em]"
      >
        00
      </span>
      <div
        ref={nameRef}
        className="absolute opacity-0"
        style={{ fontFamily: 'var(--font-clash-display)' }}
      >
        <span
          ref={firstRef}
          className="inline-block text-[clamp(3rem,10vw,8rem)] font-light tracking-[-0.04em] text-text-primary"
        >
          Naveenraj
        </span>
        <span className="inline-block mx-4" />
        <span
          ref={lastRef}
          className="inline-block text-[clamp(3rem,10vw,8rem)] font-light tracking-[-0.04em] text-text-primary opacity-60"
        >
          SS
        </span>
      </div>
    </div>
  )
}
