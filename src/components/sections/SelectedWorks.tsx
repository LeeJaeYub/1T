import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'
import { artworkImage, artworks } from '@/lib/artworks'

gsap.registerPlugin(ScrollTrigger)

const strip = artworks.filter((a) =>
  ['quiet-orchard', 'reverie', 'constance', 'the-visit', 'self-study-no-4'].includes(a.slug),
)

// Horizontal scroll-hijack: vertical scroll drives horizontal pan through a
// filmstrip of works. Canonical GSAP pattern from the awwwards-3d /
// taste-skill reference (start: "top top", pin, ease: "none", scrub).
export function SelectedWorks() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth
      if (distance <= 0) return
      gsap.to(track.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          pinType: 'transform',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section ref={wrap} className="relative overflow-hidden bg-stone-950">
      <div
        ref={track}
        className="flex h-[100dvh] items-center gap-6 px-6 will-change-transform md:gap-10 md:px-10"
      >
        <div className="flex w-[70vw] shrink-0 flex-col justify-center gap-3 md:w-[28vw]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
            Selected works
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-stone-50 md:text-4xl">
            A short walk through the studio.
          </h2>
        </div>
        {strip.map((art) => (
          <figure
            key={art.slug}
            className="flex h-[70vh] w-[78vw] shrink-0 flex-col gap-3 md:w-[34vw]"
          >
            <div className="relative h-full overflow-hidden rounded-sm">
              <img
                src={artworkImage(art)}
                alt={art.title}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex items-baseline justify-between text-stone-400">
              <span className="text-sm text-stone-200">{art.title}</span>
              <span className="font-mono text-xs">{art.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
