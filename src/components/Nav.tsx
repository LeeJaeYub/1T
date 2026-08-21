import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Magnetic } from '@/components/Magnetic'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const { scrollY } = useScroll()

  // Motion's scroll tracking (rAF-batched) instead of a raw scroll listener.
  // Only flips state when the boolean actually changes, so it does not
  // re-render on every frame.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 24
    setSolid((prev) => (prev === next ? prev : next))
  })

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center transition-colors duration-300 ${
        solid ? 'bg-stone-950/85 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="text-[15px] font-medium tracking-tight text-stone-50">
          Marisol Andrade
        </a>
        <nav className="flex items-center gap-8">
          {LINKS.map((link) => (
            <Magnetic key={link.href} strength={0.5}>
              <a
                href={link.href}
                className="text-sm text-stone-400 transition-colors hover:text-stone-50"
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
