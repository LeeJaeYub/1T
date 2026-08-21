import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import { artworkImage, artworks } from '@/lib/artworks'

gsap.registerPlugin(ScrollTrigger)

const strip = artworks.filter((a) =>
  ['quiet-orchard', 'reverie', 'constance', 'the-visit', 'self-study-no-4'].includes(a.slug),
)

// Fraction of the pan length the pin keeps holding AFTER the strip has
// finished travelling. Without it the pin releases on the exact frame the
// last frame stops moving, so horizontal motion cuts straight to vertical
// with no beat in between. This buys the outro panel a moment to land.
const TAIL = 0.16

// Horizontal scroll-hijack: vertical scroll drives horizontal pan through a
// filmstrip of works. Canonical GSAP pattern (start: "top top", pin,
// ease: "none", scrub), plus:
//  - force3D + backface-visibility on the panned layer to stop the
//    sub-pixel shimmer plain 2D transforms get on large images.
//  - a scroll-velocity-driven skew on the image layer (separate from the
//    track's x-tween, so it doesn't corrupt the pin-distance math) that
//    always decays back to upright.
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

    // Skew is tweened on a plain object rather than set directly, so it has
    // somewhere to decay to. Reading velocity alone leaves the frames frozen
    // at whatever lean the last sample happened to catch.
    const lean = { skew: 0 }
    const clampSkew = gsap.utils.clamp(-7, 7)

    const ctx = gsap.context(() => {
      const skewSetter = gsap.quickSetter(skewLayer.current, 'skewX', 'deg')

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${Math.round(getDistance() * (1 + TAIL))}`,
          pin: true,
          // Short scrub: Lenis already eases the scroll position, so a long
          // scrub on top of it double-smooths the pan into mush.
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = clampSkew(self.getVelocity() / 700)
            // Only take a reading when it is a bigger lean than the one
            // already decaying, then always tween it home to 0.
            if (Math.abs(next) <= Math.abs(lean.skew)) return
            lean.skew = next
            gsap.to(lean, {
              skew: 0,
              duration: 0.7,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => skewSetter(lean.skew),
            })
          },
        },
      })

      tl.to(track.current, { x: () => -getDistance(), duration: 1, force3D: true })
        // Empty tween: holds the strip at its end position for the tail so
        // the outro panel sits still for a moment before the pin lets go.
        .to({}, { duration: TAIL })
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
      gsap.killTweensOf(lean)
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
              <div className="relative h-full overflow-hidden [backface-visibility:hidden]">
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

        {/* Closing beat for the horizontal run: the strip ends on a line and
            a downward cue instead of on the raw edge of a photograph, so
            handing scroll back to the page reads as intended. */}
        <div className="flex w-[70vw] shrink-0 flex-col justify-center gap-4 md:w-[30vw]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
            End of the walk
          </p>
          <h3 className="max-w-[18ch] text-2xl font-medium tracking-tight text-stone-50 md:text-3xl">
            The full catalog picks up below.
          </h3>
          <motion.span
            className="flex items-center gap-2 text-sm text-stone-400"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} weight="bold" />
            Keep scrolling
          </motion.span>
        </div>
      </div>
    </section>
  )
}
