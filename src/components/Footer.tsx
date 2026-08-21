import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Magnetic } from '@/components/Magnetic'

export function Footer() {
  const reduce = useReducedMotion()

  return (
    <footer id="contact" className="bg-stone-950 px-6 pb-10 pt-24 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 border-t border-white/10 pb-16 pt-14 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="max-w-[16ch] text-3xl font-medium tracking-tight text-stone-50 md:text-5xl">
            Available for a small number of commissions in 2027.
          </h2>
          <Magnetic strength={0.4}>
            <a
              href="mailto:hello@marisolandrade.studio"
              className="group inline-flex shrink-0 items-center gap-2 text-lg text-stone-50 underline decoration-cobalt decoration-2 underline-offset-4"
            >
              Get in touch
              <ArrowUpRight
                size={18}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Magnetic>
        </motion.div>

        <div className="flex flex-col gap-3 text-xs text-stone-600 md:flex-row md:items-center md:justify-between">
          <span>&copy; 2026 Marisol Andrade. Los Angeles.</span>
          <span className="max-w-[60ch] md:text-right">
            Design template. Gallery images are public-domain museum works
            used as placeholder studies while this portfolio has no
            photographed body of work yet.
          </span>
        </div>
      </div>
    </footer>
  )
}
