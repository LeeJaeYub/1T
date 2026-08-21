import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'
import { setLenis } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// Smooth scrolling for the whole page. Renders nothing; it just takes over
// the wheel/keyboard scroll and eases it.
//
// Two things make this cooperate with GSAP instead of fighting it:
//  - Lenis is driven off gsap.ticker (one rAF loop for the page, not two),
//    and ScrollTrigger.update runs on Lenis's scroll event so the pinned
//    horizontal section stays in lockstep with the eased position.
//  - lagSmoothing(0), because GSAP's default lag correction would otherwise
//    treat a heavy frame as a reason to skip ahead, which shows up as a jump
//    in a scrubbed animation.
export function SmoothScroll() {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      // Continuous glide rather than a per-gesture duration curve. Paired
      // with a short ScrollTrigger scrub this avoids double-smoothing the
      // horizontal pan into mush.
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    })
    setLenis(lenis)

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Native anchor jumps bypass Lenis entirely and teleport the page.
    // Route them through lenis.scrollTo so nav links glide like the rest.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      const href = anchor?.getAttribute('href')
      if (!href || href.length < 2) return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -64, duration: 1.5 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduce])

  return null
}
