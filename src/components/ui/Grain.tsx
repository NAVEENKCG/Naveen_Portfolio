export function Grain() {
  return (
    <>
      <svg id="grain-filter" aria-hidden="true" style={{ position: 'fixed', width: 0, height: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[9999] pointer-events-none mix-blend-overlay"
        style={{ filter: 'url(#grain)', opacity: 0.12 }}
      />
    </>
  )
}

