import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { SPRING_HEAVY } from '@/lib/motion'

// Mouse-tracked 3D tilt + a cursor-follow spotlight glow on the border.
// Replaces a flat hover:scale with something that actually responds to
// where the cursor is, not just whether it's present. All driven by motion
// values (never useState) so it costs no React re-renders per pointer move.
export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const glowX = useMotionValue('50%')
  const glowY = useMotionValue('50%')

  const rotateX = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), SPRING_HEAVY)
  const rotateY = useSpring(useTransform(mx, [0, 1], [-maxTilt, maxTilt]), SPRING_HEAVY)
  const scale = useSpring(1, SPRING_HEAVY)

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    mx.set(px)
    my.set(py)
    glowX.set(`${px * 100}%`)
    glowY.set(`${py * 100}%`)
  }

  function handlePointerEnter() {
    scale.set(1.02)
  }

  function handlePointerLeave() {
    mx.set(0.5)
    my.set(0.5)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 800 }}
      className={`group ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="relative"
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(220px circle at ${gx} ${gy}, rgba(74,124,255,0.18), transparent 70%)`,
            ),
          }}
        />
      </motion.div>
    </motion.div>
  )
}
