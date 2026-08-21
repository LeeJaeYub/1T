import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { SPRING_LIGHT } from '@/lib/motion'

// Wraps a CTA/link so it pulls slightly toward the cursor inside a padded
// hit area, per taste-skill's "Magnetic Micro-physics" guidance: driven
// entirely by motion values, never useState, so it never re-renders React.
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING_LIGHT)
  const springY = useSpring(y, SPRING_LIGHT)

  function handlePointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.span>
  )
}
