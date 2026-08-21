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
// taste-skill reference (start: "top top", pin, ease: "none", scrub), plus:
//  - force3D + backface-visibility on the panned layer to stop the
//    sub-pixel shimmer plain 2D transforms get on large images.
//  - a scroll-velocity-driven skew on the image layer (separate from the
//    track's x-tween, so it doesn't corrupt the pin-distance math) for the
//    "picture frames leaning into the motion" feel Awwwards scroll-jacks use.
//  - a staggered vertical offset per frame so the strip reads as a
//    composed wall, not a flat filmstrip.
export function SelectedWorks() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const skewLayer = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return

    // Measured fresh on every refresh (mount, resize, font/image load) rather
    // than captured once. Capturing it as a const desynced the pin length from
    // the actual travel whenever the window width changed: the pin kept holding
    // for the old distance while the strip only needed the new one, leaving a
    // blank region, and x overshot past the end of the strip.
    const getDistance = () =>
      Math.max(0, track.current!.scrollWidth - window.innerWidth)

    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickTo(skewLayer.current, 'skewX', {
        duration: 0.5,
        ease: 'power3',
      })

      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const v = self.getVelocity() / 1000
            skewSetter(gsap.utils.clamp(-6, 6, v))
          },
          onLeave: () => skewSetter(0),
          onLeaveBack: () => skewSetter(0),
        },
      })
    }, wrap)

    // Fonts and images change the strip's width after first paint; re-measure
    // once they settle so start/end match the final layout.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    const imgs = Array.from(wrap.current.querySelectorAll('img'))
    const pending = imgs.filter((img) => !img.complete)
    pending.forEach((img) => img.addEventListener('load', refresh, { once: true }))

    return () => {
      pending.forEach((img) => img.removeEventListener('load', refresh))
      ctx.revert()
    }
  }, [reduce])

  return (
    <section ref={wrap} className="relative overflow-hidden bg-stone-950">
      <div
        ref={track}
        className="flex h-[100dvh] items-center gap-6 px-6 will-change-transform [backface-visibility:hidden] md:gap-10 md:px-10"
      >
        <div className="flex w-[70vw] shrink-0 flex-col justify-center gap-3 md:w-[28vw]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
            Selected works
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-stone-50 md:text-4xl">
            A short walk through the studio.
          </h2>
        </div>
        <div ref={skewLayer} className="flex items-center gap-6 will-change-transform md:gap-10">
          {strip.map((art, i) => (
            <figure
              key={art.slug}
              style={{ transform: i % 2 === 1 ? 'translateY(-3rem)' : 'translateY(3rem)' }}
              className="flex h-[70vh] w-[78vw] shrink-0 flex-col gap-3 md:w-[34vw]"
            >
              <div className="relative h-full overflow-hidden rounded-sm [backface-visibility:hidden]">
                <img
                  src={artworkImage(art)}
                  alt={art.title}
                  className="h-full w-full object-cover [backface-visibility:hidden]"
                />
              </div>
              <figcaption className="flex items-baseline justify-between text-stone-400">
                <span className="text-sm text-stone-200">{art.title}</span>
                <span className="font-mono text-xs">{art.year}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
