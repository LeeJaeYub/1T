import { motion, useReducedMotion } from 'motion/react'
import { artworkImage, artworks } from '@/lib/artworks'

const detail = artworks.find((a) => a.slug === 'village-edge')!

export function About() {
  const reduce = useReducedMotion()

  return (
    <section id="about" className="bg-stone-950 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 aspect-[5/6] overflow-hidden rounded-sm border border-white/10 md:order-2 md:col-span-5 md:col-start-8"
        >
          <img
            src={artworkImage(detail)}
            alt=""
            className="h-full w-full scale-[1.6] object-cover"
            style={{ objectPosition: '30% 40%' }}
          />
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 flex flex-col gap-5 md:order-1 md:col-span-6"
        >
          <h2 className="text-3xl font-medium tracking-tight text-stone-50 md:text-4xl">
            About
          </h2>
          <p className="max-w-[52ch] text-base leading-relaxed text-stone-400">
            I trained as a copyist before I trusted myself with a blank
            canvas, working from the old portraits and harbor scenes at the
            museum on Saturdays. That habit never left. Most paintings here
            start the same way: a smaller study, in oil, of a painting I
            can't stop thinking about, followed by a larger canvas that
            drifts away from it.
          </p>
          <p className="max-w-[52ch] text-base leading-relaxed text-stone-400">
            I work out of a converted garage in the hills outside the city,
            usually on two or three canvases at once, and I show new work in
            small batches rather than on a schedule.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
