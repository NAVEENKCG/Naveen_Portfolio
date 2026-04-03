'use client'

import { useEffect, useRef } from 'react'

/* ────────────────────────────────────────────
   OscilloscopeCanvas — Lightweight canvas-based
   oscilloscope waveform background for the Hero.
   
   PERF DECISIONS:
   • Pure requestAnimationFrame — no Three.js overhead
   • Canvas 2D only — minimal GPU footprint
   • Uses sin wave + Perlin-like noise for organic feel
   • Renders at half resolution on mobile (< 768px)
   • Auto-pauses when tab is hidden (via visibilitychange)
   • Respects prefers-reduced-motion (static waveform)
   ──────────────────────────────────────────── */
export function OscilloscopeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    let animId: number = 0
    let time = 0
    let paused = false

    const resize = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Simple seeded noise for organic waveform variation
    const noise = (x: number) => {
      const n = Math.sin(x * 127.1 + 311.7) * 43758.5453
      return n - Math.floor(n)
    }

    const draw = () => {
      if (paused) {
        animId = requestAnimationFrame(draw)
        return
      }

      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      // Draw multiple waveform lines with different phase/amplitude
      const waves = [
        { amp: 40, freq: 0.008, speed: 0.015, alpha: 0.25, color: '255, 77, 0' },     // accent
        { amp: 25, freq: 0.012, speed: 0.020, alpha: 0.12, color: '255, 77, 0' },     // accent dim
        { amp: 60, freq: 0.005, speed: 0.008, alpha: 0.08, color: '200, 255, 0' },    // lime trace
      ]

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha})`
        ctx.lineWidth = 1.5

        for (let x = 0; x < w; x += 2) {
          const normalizedX = x / w
          // Primary sine + harmonic + noise
          const y =
            h * 0.5 +
            wave.amp * Math.sin(x * wave.freq + time * wave.speed) +
            wave.amp * 0.3 * Math.sin(x * wave.freq * 2.5 + time * wave.speed * 1.7) +
            (noise(normalizedX * 10 + time * 0.001) - 0.5) * wave.amp * 0.5

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      // Horizontal scan line effect
      const scanY = (h * 0.5) + Math.sin(time * 0.005) * h * 0.15
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 77, 0, 0.06)'
      ctx.lineWidth = 1
      ctx.moveTo(0, scanY)
      ctx.lineTo(w, scanY)
      ctx.stroke()

      // Grid lines (subtle oscilloscope grid)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)'
      ctx.lineWidth = 0.5
      const gridSpacing = 60
      for (let gx = 0; gx < w; gx += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, h)
        ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }

      time++
      animId = requestAnimationFrame(draw)
    }

    // If reduced motion, draw a single static frame
    if (prefersReducedMotion) {
      draw()
      cancelAnimationFrame(animId)
    } else {
      draw()
    }

    // Pause when tab is hidden
    const onVisibilityChange = () => {
      paused = document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Pause when scrolled out of view (crucial for scroll performance!)
    const observer = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting || document.hidden
      },
      { rootMargin: '100px' }
    )
    if (canvas) observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden="true"
    />
  )
}

export { OscilloscopeCanvas as default }
