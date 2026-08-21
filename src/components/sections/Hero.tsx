import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import { Magnetic } from '@/components/Magnetic'
import { artworkImage, artworks } from '@/lib/artworks'

const featured = artworks.find((a) => a.slug === 'the-net')!

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<SVGAnimateElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 180,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 180,
    damping: 18,
  })
  // Image drifts opposite the tilt (a hair of parallax "inside" the frame)
  // instead of sitting dead-center no matter where the cursor is.
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), {
    stiffness: 150,
    damping: 20,
  })
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  })

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handlePointerEnter() {
    rippleRef.current?.beginElement()
  }

  function handlePointerLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="top"
      className="grid min-h-[100dvh] grid-cols-1 items-center gap-10 px-6 pt-24 md:grid-cols-12 md:gap-6 md:px-10 md:pt-16 lg:pt-0"
    >
      <div className="order-2 flex flex-col gap-6 md:order-1 md:col-span-5">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-4xl font-medium tracking-tight text-stone-50 md:text-6xl"
        >
          Paintings that hold their <em className="not-italic text-cobalt">quiet</em>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="max-w-[42ch] text-base leading-relaxed text-stone-400"
        >
          Oil studies of ordinary light, worked slowly, in the tradition of the
          painters who taught me to look.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Magnetic strength={0.3}>
            <a
              href="#work"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-50 underline decoration-cobalt decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
            >
              View the work
              <ArrowDown size={14} weight="bold" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        style={{ perspective: 1200 }}
        className="group order-1 md:order-2 md:col-span-7 md:col-start-6"
      >
        {/* Hidden filter def: a faint oil-on-canvas ripple that wakes up
            on hover, instead of the image just sitting there being a jpeg. */}
        <svg width="0" height="0" className="absolute">
          <filter id="paint-ripple">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G">
              <animate
                ref={rippleRef}
                attributeName="scale"
                values="0;16;0"
                dur="1.8s"
                begin="indefinite"
                fill="freeze"
              />
            </feDisplacementMap>
          </filter>
        </svg>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] md:aspect-[16/11]"
        >
          <motion.img
            src={artworkImage(featured)}
            alt={featured.title}
            style={{ x: imgX, y: imgY, scale: 1.08 }}
            className="h-full w-full object-cover [filter:url(#paint-ripple)]"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
