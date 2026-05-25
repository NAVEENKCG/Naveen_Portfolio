'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const label = labelRef.current
    if (!dot || !label) return

    // Skip on mobile — no custom cursor needed
    if (window.innerWidth < 768) return

    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 })

    const xTo = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" })
    const yTo = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" })

    let isVisible = false

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to(dot, { opacity: 1, duration: 0.3 })
        isVisible = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }

    /* Event delegation — eliminates the expensive MutationObserver + querySelectorAll
       that was triggering on every Framer Motion style update during scroll */
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      if (!target) return
      const type = target.dataset.cursor
      const cursorLabel = target.dataset.cursorLabel || 'VIEW'
      if (type === 'interactive') {
        gsap.to(dot, { width: 80, height: 80, backgroundColor: 'var(--accent)', duration: 0.3, ease: 'power2.out' })
        label.textContent = cursorLabel
        gsap.to(label, { opacity: 1, duration: 0.2 })
      } else if (type === 'text') {
        gsap.to(dot, { width: 4, height: 4, backgroundColor: 'var(--accent)', duration: 0.3 })
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      if (!target) return
      // Only reset if we're leaving the [data-cursor] element entirely
      const related = e.relatedTarget as HTMLElement | null
      if (related && target.contains(related)) return
      gsap.to(dot, { width: 12, height: 12, backgroundColor: 'var(--accent)', duration: 0.3, ease: 'power2.out' })
      label.textContent = ''
      gsap.to(label, { opacity: 0, duration: 0.2 })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[10000] flex items-center justify-center"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <span
          ref={labelRef}
          className="font-heading text-[10px] uppercase font-bold tracking-[0.15em] text-white opacity-0 whitespace-nowrap"
        />
      </div>
    </>
  )
}

