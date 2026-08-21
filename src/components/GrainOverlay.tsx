// Fixed, pointer-events-none film-grain texture: gives the dark gallery
// background a canvas-like tactility instead of flat digital black.
// Per taste-skill 6.E: grain lives on a fixed pseudo-layer only, never on a
// scrolling container, so it never costs a repaint while scrolling.
export function GrainOverlay() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.05] mix-blend-overlay"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}
