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

    // Ensure dot is perfectly centered and hidden until mouse moves
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 })

    let isVisible = false

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to(dot, { opacity: 1, duration: 0.3 })
        isVisible = true
      }
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const addInteractive = () => {
      document.querySelectorAll('[data-cursor]').forEach((el) => {
        const htmlEl = el as HTMLElement
        // Remove old listeners to prevent duplicates
        htmlEl.onmouseenter = null
        htmlEl.onmouseleave = null

        htmlEl.onmouseenter = () => {
          const type = htmlEl.dataset.cursor
          const cursorLabel = htmlEl.dataset.cursorLabel || 'VIEW'
          if (type === 'interactive') {
            gsap.to(dot, { width: 80, height: 80, backgroundColor: 'var(--accent)', duration: 0.3, ease: 'power2.out' })
            label.textContent = cursorLabel
            gsap.to(label, { opacity: 1, duration: 0.2 })
          } else if (type === 'text') {
            gsap.to(dot, { width: 4, height: 4, backgroundColor: 'var(--accent)', duration: 0.3 })
          }
        }
        htmlEl.onmouseleave = () => {
          gsap.to(dot, { width: 12, height: 12, backgroundColor: 'var(--accent)', duration: 0.3, ease: 'power2.out' })
          label.textContent = ''
          gsap.to(label, { opacity: 0, duration: 0.2 })
        }
      })
    }

    document.addEventListener('mousemove', onMouseMove)

    const timeout = setTimeout(addInteractive, 1000)
    const observer = new MutationObserver(() => {
      setTimeout(addInteractive, 200)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      clearTimeout(timeout)
      observer.disconnect()
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
