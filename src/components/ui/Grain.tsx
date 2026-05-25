/* Grain overlay using a lightweight CSS noise texture instead of SVG feTurbulence.
   feTurbulence forces full-page GPU re-compositing on every scroll frame — this static
   approach gives the same visual at near-zero cost. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        opacity: 0.08,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

