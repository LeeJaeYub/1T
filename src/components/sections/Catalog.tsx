import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { TiltCard } from '@/components/TiltCard'
import { getLenis } from '@/lib/lenis'
import { EASE_OUT } from '@/lib/motion'
import { artworkImage, artworks, type Artwork } from '@/lib/artworks'

export function Catalog() {
  const [active, setActive] = useState<Artwork | null>(null)
  const reduce = useReducedMotion()

  // Radix locks body overflow while the lightbox is open, but Lenis drives
  // its own scroll position and would keep gliding the page behind it.
  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    if (active) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [active])

  return (
    <section id="work" className="bg-stone-950 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-14 max-w-[26ch] text-3xl font-medium tracking-tight text-stone-50 md:text-4xl">
          The full catalog, 2021 to now.
        </h2>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {artworks.map((art, i) => (
            <motion.button
              key={art.slug}
              type="button"
              onClick={() => setActive(art)}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 1,
                delay: (i % 3) * 0.11,
                ease: EASE_OUT,
              }}
              className="group mb-6 block w-full break-inside-avoid text-left"
            >
              <TiltCard className="block overflow-hidden" maxTilt={7}>
                <img
                  src={artworkImage(art)}
                  alt={art.title}
                  loading="lazy"
                  className="w-full"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </TiltCard>
              <span className="mt-3 flex items-baseline justify-between">
                <span className="text-sm text-stone-200">{art.title}</span>
                <span className="font-mono text-xs text-stone-500">{art.year}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl rounded-sm border-white/10 bg-stone-950 p-0"
        >
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active && (
            <div>
              <div className="relative">
                <img
                  src={artworkImage(active)}
                  alt={active.title}
                  className="max-h-[70vh] w-full object-contain bg-black"
                />
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-stone-950/70 text-stone-200 backdrop-blur-sm transition-colors hover:text-white"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-6 py-5">
                <span className="text-lg text-stone-50">{active.title}</span>
                <span className="text-sm text-stone-400">
                  {active.medium}, {active.year}
                </span>
                <span className="font-mono text-xs text-stone-600">
                  Study after {active.sourceArtist}, {active.sourceTitle} ({active.sourceYear})
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
